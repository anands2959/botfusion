import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get chatbot configuration for embedding
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const apiKey = params.id;

    // Find chatbot by API key
    const chatbot = await prisma.chatbot.findUnique({
      where: { apiKey },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // Return chatbot configuration for embedding
    return NextResponse.json({
      name: chatbot.name,
      welcomeMessage: chatbot.welcomeMessage,
      logoUrl: chatbot.logoUrl,
      colorScheme: chatbot.colorScheme,
      widgetPosition: chatbot.widgetPosition,
    }, { status: 200 });
  } catch (error) {
    console.error('Embed API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching chatbot configuration' },
      { status: 500 }
    );
  }
}