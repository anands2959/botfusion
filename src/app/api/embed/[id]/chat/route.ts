// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// // Helper function to add CORS headers
// function corsHeaders() {
//   return {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   };
// }

// // Handle OPTIONS requests for CORS preflight
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: corsHeaders(),
//   });
// }

// // Handle chat messages from embedded chatbot
// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // In Next.js 15, params is a Promise that needs to be awaited
//     let { id: apiKey } = await params;
//     const { message } = await req.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: 'Message is required' },
//         { 
//           status: 400,
//           headers: corsHeaders()
//         }
//       );
//     }

//     // Check if the API key is an inactive key
//     if (apiKey.startsWith('inactive_')) {
//       return NextResponse.json(
//         { error: 'Invalid API key' },
//         { 
//           status: 403,
//           headers: corsHeaders()
//         }
//       );
//     }

//     // Find chatbot by API key
//     const chatbot = await prisma.chatbot.findUnique({
//       where: { apiKey },
//       include: { trainingSources: true },
//     });

//     if (!chatbot) {
//       return NextResponse.json(
//         { error: 'Chatbot not found' },
//         { 
//           status: 404,
//           headers: corsHeaders()
//         }
//       );
//     }

//     // Check if chatbot has any completed training sources
//     const hasTrainedData = chatbot.trainingSources.some(source => source.status === 'completed');

//     // Get the user's settings to determine which AI model to use
//     // Find the user who owns this chatbot
//     const user = await prisma.user.findFirst({
//       where: { chatbots: { some: { id: chatbot.id } } },
//       include: { settings: true },
//     });

//     if (!user || !user.settings) {
//       return NextResponse.json(
//         { error: 'User settings not found' },
//         { 
//           status: 404,
//           headers: corsHeaders()
//         }
//       );
//     }

//     // Get the selected AI model and API key
//     const selectedModel = user.settings.defaultAIModel || 'chatgpt-free';
//     // let apiKey = '';
//     let provider = '';

//     // Determine which API key to use based on the selected model
//     if (selectedModel === 'chatgpt-free' || selectedModel === 'chatgpt-pro') {
//       apiKey = user.settings.openaiApiKey || '';
//       provider = 'openai';
//     } else if (selectedModel === 'claude-free' || selectedModel === 'claude-pro') {
//       apiKey = user.settings.anthropicApiKey || '';
//       provider = 'anthropic';
//     } else if (selectedModel === 'gemini-free' || selectedModel === 'gemini-pro') {
//       apiKey = user.settings.googleApiKey || '';
//       provider = 'google';
//     } else if (selectedModel === 'deepseek-free' || selectedModel === 'deepseek-pro') {
//       apiKey = user.settings.deepseekApiKey || '';
//       provider = 'deepseek';
//     }

//     // Check if API key is available
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: `API key for ${provider} is not configured. Please add your API key in the settings.` },
//         { 
//           status: 400,
//           headers: corsHeaders()
//         }
//       );
//     }

//     let response;

//     if (hasTrainedData) {
//       // Get all completed training sources for this chatbot
//       // const completedSources = chatbot.trainingSources.filter(source => source.status === 'completed');

//       try {
//         // Import the vector database search function
//         const { searchSimilarContent } = await import('@/lib/vector-db');

//         console.log(`Analyzing question: "${message}" using ${provider} model`);

//         // Search for relevant content based on the user's question
//         const searchResults = await searchSimilarContent(message, chatbot.id, provider, apiKey);

//         // Generate a professional response based on the selected AI model
//         // const modelInfo = {
//         //   'chatgpt-free': {
//         //     name: 'ChatGPT',
//         //     style: 'concise and informative'
//         //   },
//         //   'claude-free': {
//         //     name: 'Claude',
//         //     style: 'thoughtful and nuanced'
//         //   },
//         //   'gemini-free': {
//         //     name: 'Gemini',
//         //     style: 'comprehensive and analytical'
//         //   },
//         //   'deepseek-free': {
//         //     name: 'DeepSeek',
//         //     style: 'technical and precise'
//         //   }
//         // };

//         // const modelDetails = modelInfo[selectedModel] || { name: provider, style: 'helpful' };

//         // Handle common greetings and farewells
//         const lowercaseMessage = message.toLowerCase();

//         if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
//           response = `Hello! I'm here to help answer your questions. How can I assist you today?`;
//         } else if (lowercaseMessage.includes('thank')) {
//           response = 'You\'re welcome! I\'m glad I could assist you. Feel free to ask if you have any more questions.';
//         } else if (lowercaseMessage.includes('bye') || lowercaseMessage.includes('goodbye')) {
//           response = 'Goodbye! Feel free to return whenever you need assistance.';
//         } else {
//           // If we have relevant content from the vector search
//           if (searchResults.length > 0) {
//             // Get the most relevant content chunks
//             const relevantContent = searchResults
//               .filter(result => result.similarity > 0.7) // Only use results with high similarity
//               .map(result => result.content)
//               .join('\n\n');

//             // Use the appropriate AI model based on the provider
//             if (provider === 'google') {
//               // Use Google's Gemini model
//               const { GoogleGenAI } = await import('@google/genai');
//               const genAI = new GoogleGenAI({ apiKey });
//               const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//               const result = await model.generateContent({
//                 contents: [
//                   {
//                     role: 'user',
//                     parts: [{
//                       text: `You are a helpful assistant that answers questions based on the provided content. 
//                       Only use the information in the provided content to answer the question. 
//                       If the content doesn't contain relevant information to answer the question, say that you don't have enough information. 
//                       Do not mention the source of your information or refer to the provided content in your answer. 
//                       Keep your answers concise and to the point.

//                       Content: ${relevantContent}

//                       Question: ${message}`
//                     }]
//                   }
//                 ],
//                 generationConfig: {
//                   temperature: 0.7,
//                   maxOutputTokens: 500,
//                 }
//               });

//               response = result.response.text().trim();
//             } else {
//               // Use OpenAI as default
//               const OpenAI = (await import('openai')).OpenAI;
//               const openai = new OpenAI({ apiKey });

//               const completion = await openai.chat.completions.create({
//                 model: "gpt-3.5-turbo",
//                 messages: [
//                   {
//                     role: "system",
//                     content: `You are a helpful assistant that answers questions based on the provided content. 
//                     Only use the information in the provided content to answer the question. 
//                     If the content doesn't contain relevant information to answer the question, say that you don't have enough information. 
//                     Do not mention the source of your information or refer to the provided content in your answer. 
//                     Keep your answers concise and to the point.`
//                   },
//                   {
//                     role: "user",
//                     content: `Content: ${relevantContent}\n\nQuestion: ${message}`
//                   }
//                 ],
//                 temperature: 0.7,
//                 max_tokens: 500
//               });

//               response = completion.choices[0].message.content.trim();
//             }
//           } else {
//             // No relevant content found
//             response = "I'm sorry, but I don't have enough information to answer that question. Could you try asking something else related to the content I was trained on?";
//           }
//         }
//       } catch (error) {
//         console.error('Error generating response:', error);
//         response = `I encountered an issue while processing your question with the ${selectedModel} model. Please try again or contact support if the problem persists.`;
//       }
//     } else {
//       response = 'This chatbot hasn\'t been trained with any data yet. Please contact the administrator to add training sources.';
//     }

//     // In a production environment, you would also log this interaction
//     // await prisma.chatInteraction.create({
//     //   data: {
//     //     chatbotId: chatbot.id,
//     //     userMessage: message,
//     //     botResponse: response,
//     //   },
//     // });

//     return NextResponse.json({ response }, { 
//       status: 200,
//       headers: corsHeaders()
//     });
//   } catch (error) {
//     console.error('Chat API error:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while processing your message' },
//       { 
//         status: 500,
//         headers: corsHeaders()
//       }
//     );
//   }
// }

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

      if (/^(hi|hello)\b/i.test(lowercaseMessage)) {
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
