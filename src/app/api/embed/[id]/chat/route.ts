import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle chat messages from embedded chatbot
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const apiKey = params.id;
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

    // Generate response based on trained data
    // In a real implementation, this would use a vector database or LLM to generate responses
    // based on the trained data from the chatbot's training sources
    let response;
    
    if (hasTrainedData) {
      // Simple keyword-based response for demonstration
      const lowercaseMessage = message.toLowerCase();
      
      if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
        response = `Hello! I'm ${chatbot.name}. How can I help you today?`;
      } else if (lowercaseMessage.includes('help')) {
        response = 'I can answer questions based on the information I was trained on. What would you like to know?';
      } else if (lowercaseMessage.includes('thank')) {
        response = 'You\'re welcome! Is there anything else I can help you with?';
      } else if (lowercaseMessage.includes('bye') || lowercaseMessage.includes('goodbye')) {
        response = 'Goodbye! Feel free to come back if you have more questions.';
      } else {
        response = `Based on my training, I would respond to "${message}" with relevant information from the trained data sources. In a production environment, this would use a vector database or LLM to generate accurate responses.`;
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