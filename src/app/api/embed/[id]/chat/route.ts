
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: routeApiKey } = params;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400, headers: corsHeaders() });
    }

    if (routeApiKey.startsWith('inactive_')) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 403, headers: corsHeaders() });
    }

    const chatbot = await prisma.chatbot.findUnique({
      where: { apiKey: routeApiKey },
      include: { trainingSources: true },
    });

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404, headers: corsHeaders() });
    }

    const hasTrainedData = chatbot.trainingSources.some(source => source.status === 'completed');

    const user = await prisma.user.findFirst({
      where: { chatbots: { some: { id: chatbot.id } } },
      include: { settings: true },
    });

    if (!user || !user.settings) {
      return NextResponse.json({ error: 'User settings not found' }, { status: 404, headers: corsHeaders() });
    }

    const selectedModel = user.settings.defaultAIModel || 'chatgpt-free';
    const modelApiKeys = {
      'chatgpt-free': user.settings.openaiApiKey,
      'chatgpt-pro': user.settings.openaiApiKey,
      'claude-free': user.settings.anthropicApiKey,
      'claude-pro': user.settings.anthropicApiKey,
      'gemini-free': user.settings.googleApiKey,
      'gemini-pro': user.settings.googleApiKey,
      'deepseek-free': user.settings.deepseekApiKey,
      'deepseek-pro': user.settings.deepseekApiKey,
    };

    const modelApiKey = modelApiKeys[selectedModel];
    const provider = selectedModel.split('-')[0]; // 'chatgpt', 'gemini', etc.

    if (!modelApiKey) {
      return NextResponse.json(
        { error: `API key for ${provider} is not configured. Please add it in your settings.` },
        { status: 400, headers: corsHeaders() }
      );
    }

    let response = '';

    if (!hasTrainedData) {
      response = 'This chatbot hasn\'t been trained with any data yet. Please contact the administrator to add training sources.';
    } else {
      const { searchSimilarContent } = await import('@/lib/vector-db');

      const lowercaseMessage = message.toLowerCase();

      if (/^(hi|hello|hii|hey)\b/i.test(lowercaseMessage)) {
        response = 'Hello! I\'m here to help answer your questions. How can I assist you today?';
      } else if (/thank/i.test(lowercaseMessage)) {
        response = 'You\'re welcome! Feel free to ask more questions.';
      } else if (/bye|goodbye/i.test(lowercaseMessage)) {
        response = 'Goodbye! Reach out anytime you need assistance.';
      } else {
        try {
          const searchResults = await searchSimilarContent(message, chatbot.id, provider, modelApiKey);
          console.log('Search results:', searchResults.map(r => ({ similarity: r.similarity, contentPreview: r.content.substring(0, 50) })));

          if (searchResults.length > 0) {
            const filteredResults = searchResults.filter(r => r.similarity > 0.5);
            console.log('Filtered results count:', filteredResults.length);

            const relevantContent = filteredResults
              .map(r => r.content)
              .join('\n\n');

            if (relevantContent.trim() === '') {
              console.log('No relevant content found');
              response = "I'm sorry, but I don't have enough relevant information to answer that question. Could you try asking something else related to the training content?";
            } else {
              //               const prompt = `You are a helpful assistant that answers questions based on the provided content. 
              // use the information in the content. If there's not enough info, say that. Do not refer to the content or mention a source. 
              // Keep answers concise and to the point.analyze the question and the content and answer the question based on the content. and relevant to the question.
              // \n\nContent: ${relevantContent}\n\nQuestion: ${message}`;
              const prompt = `You are a knowledgeable assistant. Your task is to analyze the given question and answer it strictly based on the provided content.
              - Carefully analyze the question.
              - Answer concisely and directly using only the information found in the content.
              - Do not include external knowledge, assumptions, or opinions.
              - If the content does not provide enough information to answer, clearly state that.
              Content: ${relevantContent}
              Question: ${message}`;

              if (provider === 'google' || provider === 'gemini') {
                const { GoogleGenerativeAI } = await import('@google/generative-ai');
                const genAI = new GoogleGenerativeAI(modelApiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
                const result = await model.generateContent({
                  contents: [{ role: 'user', parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
                });
                response = result.response.text().trim();
              } else {
                const OpenAI = (await import('openai')).OpenAI;
                const openai = new OpenAI({ apiKey: modelApiKey });

                const completion = await openai.chat.completions.create({
                  model: 'gpt-3.5-turbo',
                  messages: [
                    { role: 'system', content: prompt.split('\n\nQuestion:')[0] },
                    { role: 'user', content: `Content: ${relevantContent}\n\nQuestion: ${message}` }
                  ],
                  temperature: 0.7,
                  max_tokens: 500
                });
                response = completion.choices[0].message.content.trim();
              }
            }
          } else {
            response = "I'm sorry, but I don't have enough information to answer that question. Could you try asking something else related to the training content?";
          }
        } catch (error) {
          console.error('Error generating response:', error?.stack || error);
          response = `There was an issue using the ${selectedModel} model. Please try again or contact support.`;
        }
      }
    }

    return NextResponse.json({ response }, { status: 200, headers: corsHeaders() });

  } catch (error) {
    console.error('Chat API error:', error?.stack || error);
    return NextResponse.json(
      { error: 'An error occurred while processing your message' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
