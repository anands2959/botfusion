import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle chat messages from embedded chatbot
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In Next.js 15, params is a Promise that needs to be awaited
    let { id: apiKey } = await params;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if the API key is an inactive key
    if (apiKey.startsWith('inactive_')) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 403 }
      );
    }

    // Find chatbot by API key
    const chatbot = await prisma.chatbot.findUnique({
      where: { apiKey },
      include: { trainingSources: true },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // Check if chatbot has any completed training sources
    const hasTrainedData = chatbot.trainingSources.some(source => source.status === 'completed');

    // Get the user's settings to determine which AI model to use
    // Find the user who owns this chatbot
    const user = await prisma.user.findFirst({
      where: { chatbots: { some: { id: chatbot.id } } },
      include: { settings: true },
    });

    if (!user || !user.settings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      );
    }

    // Get the selected AI model and API key
    const selectedModel = user.settings.defaultAIModel || 'chatgpt-free';
    // let apiKey = '';
    let provider = '';

    // Determine which API key to use based on the selected model
    if (selectedModel === 'chatgpt-free') {
      apiKey = user.settings.openaiApiKey || '';
      provider = 'openai';
    } else if (selectedModel === 'claude-free') {
      apiKey = user.settings.anthropicApiKey || '';
      provider = 'anthropic';
    } else if (selectedModel === 'gemini-free') {
      apiKey = user.settings.googleApiKey || '';
      provider = 'google';
    } else if (selectedModel === 'deepseek-free') {
      apiKey = user.settings.deepseekApiKey || '';
      provider = 'deepseek';
    }

    // Check if API key is available
    if (!apiKey) {
      return NextResponse.json(
        { error: `API key for ${provider} is not configured. Please add your API key in the settings.` },
        { status: 400 }
      );
    }

    let response;
    
    if (hasTrainedData) {
      // Get all completed training sources for this chatbot
      const completedSources = chatbot.trainingSources.filter(source => source.status === 'completed');
      
      try {
        // Import the vector database search function
        const { searchSimilarContent } = await import('@/lib/vector-db');
        
        console.log(`Analyzing question: "${message}" using ${provider} model`);
        
        // Search for relevant content based on the user's question
        const searchResults = await searchSimilarContent(message, chatbot.id, provider, apiKey);
        
        // Generate a professional response based on the selected AI model
        const modelInfo = {
          'chatgpt-free': {
            name: 'ChatGPT',
            style: 'concise and informative'
          },
          'claude-free': {
            name: 'Claude',
            style: 'thoughtful and nuanced'
          },
          'gemini-free': {
            name: 'Gemini',
            style: 'comprehensive and analytical'
          },
          'deepseek-free': {
            name: 'DeepSeek',
            style: 'technical and precise'
          }
        };
        
        const modelDetails = modelInfo[selectedModel] || { name: provider, style: 'helpful' };
        
        // Handle common greetings and farewells
        const lowercaseMessage = message.toLowerCase();
        
        if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
          response = `Hello! I'm here to help answer your questions. How can I assist you today?`;
        } else if (lowercaseMessage.includes('thank')) {
          response = 'You\'re welcome! I\'m glad I could assist you. Feel free to ask if you have any more questions.';
        } else if (lowercaseMessage.includes('bye') || lowercaseMessage.includes('goodbye')) {
          response = 'Goodbye! Feel free to return whenever you need assistance.';
        } else {
          // If we have relevant content from the vector search
          if (searchResults.length > 0) {
            // Get the most relevant content chunks
            const relevantContent = searchResults
              .filter(result => result.similarity > 0.7) // Only use results with high similarity
              .map(result => result.content)
              .join('\n\n');
            
            // Use OpenAI to generate a response based on the relevant content
            const OpenAI = (await import('openai')).OpenAI;
            const openai = new OpenAI({ apiKey });
            
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: `You are a helpful assistant that answers questions based on the provided content. 
                  Only use the information in the provided content to answer the question. 
                  If the content doesn't contain relevant information to answer the question, say that you don't have enough information. 
                  Do not mention the source of your information or refer to the provided content in your answer. 
                  Keep your answers concise and to the point.`
                },
                {
                  role: "user",
                  content: `Content: ${relevantContent}\n\nQuestion: ${message}`
                }
              ],
              temperature: 0.7,
              max_tokens: 500
            });
            
            response = completion.choices[0].message.content.trim();
          } else {
            // No relevant content found
            response = "I'm sorry, but I don't have enough information to answer that question. Could you try asking something else related to the content I was trained on?";
          }
        }
      } catch (error) {
        console.error('Error generating response:', error);
        response = `I encountered an issue while processing your question with the ${selectedModel} model. Please try again or contact support if the problem persists.`;
      }
    } else {
      response = 'This chatbot hasn\'t been trained with any data yet. Please contact the administrator to add training sources.';
    }

    // In a production environment, you would also log this interaction
    // await prisma.chatInteraction.create({
    //   data: {
    //     chatbotId: chatbot.id,
    //     userMessage: message,
    //     botResponse: response,
    //   },
    // });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your message' },
      { status: 500 }
    );
  }
}