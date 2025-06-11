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
      
      // In a production environment, this would be replaced with actual vector database search
      // For now, we'll simulate the process of retrieving relevant content and generating a response
      
      try {
        // Simulate analyzing the user's question
        console.log(`Analyzing question: "${message}" using ${provider} model`);
        
        // Get the training sources information to include in the response
        const sourceInfo = completedSources.map(source => {
          if (source.type === 'website') {
            return `Website: ${source.url}`;
          } else {
            return `Document: ${source.filename}`;
          }
        }).join('\n- ');
        
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
        
        // Simulate the AI analyzing the question and generating a response
        const lowercaseMessage = message.toLowerCase();
        
        if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
          response = `Hello! I'm ${chatbot.name}, your AI assistant powered by ${modelDetails.name}. I've been trained on your content and I'm here to help answer your questions in a ${modelDetails.style} manner.`;
        } else if (lowercaseMessage.includes('help')) {
          response = `I can provide information based on the content I was trained on. I've analyzed the following sources:\n- ${sourceInfo}\n\nWhat specific information are you looking for?`;
        } else if (lowercaseMessage.includes('thank')) {
          response = 'You\'re welcome! I\'m glad I could assist you. If you have any more questions about your content, feel free to ask.';
        } else if (lowercaseMessage.includes('bye') || lowercaseMessage.includes('goodbye')) {
          response = 'Goodbye! Feel free to return whenever you need assistance with your content.';
        } else {
          // Simulate a more detailed response that would come from the AI model
          response = `Based on the content I was trained on, I can provide the following information about "${message}":\n\nAs your ${modelDetails.style} assistant powered by ${modelDetails.name}, I've analyzed your question against the content from:\n- ${sourceInfo}\n\nIn a production environment, I would retrieve the most relevant information from these sources and generate a comprehensive response using the ${selectedModel} model with your ${provider} API key.\n\nIs there a specific aspect of this topic you'd like me to focus on?`;
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