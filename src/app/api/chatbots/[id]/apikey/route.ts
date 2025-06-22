import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Generate a new API key for a chatbot
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    // In Next.js 15, params is a Promise that needs to be awaited
    const { id: chatbotId } = await params;

    // Check if chatbot exists and belongs to the user
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    if (chatbot.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to access this chatbot' },
        { status: 403 }
      );
    }

    // Generate a unique API key
    let apiKey: string;
    let isUnique = false;
    
    // Keep generating keys until we find a unique one
    while (!isUnique) {
      apiKey = `bf_${crypto.randomBytes(16).toString('hex')}`;
      
      // Check if this key already exists
      const existingChatbot = await prisma.chatbot.findUnique({
        where: { apiKey },
      });
      
      if (!existingChatbot) {
        isUnique = true;
      }
    }

    // Update the chatbot with the new API key
    const updatedChatbot = await prisma.chatbot.update({
      where: { id: chatbotId },
      data: { apiKey },
    });

    // Generate embed script
    const embedScript = `<script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://botfusion-ten.vercel.app'}/embed.js" data-chatbot-id="${apiKey}"></script>`;

    return NextResponse.json({
      apiKey,
      embedScript,
    }, { status: 200 });
  } catch (error) {
    console.error('Generate API key error:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating API key' },
      { status: 500 }
    );
  }
}

// Delete an API key for a chatbot
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    // In Next.js 15, params is a Promise that needs to be awaited
    const { id: chatbotId } = await params;

    // Check if chatbot exists and belongs to the user
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    if (chatbot.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to access this chatbot' },
        { status: 403 }
      );
    }

    // Generate a unique inactive API key instead of using null
    const inactiveApiKey = `inactive_${crypto.randomBytes(16).toString('hex')}`;
    
    // Replace the API key with an inactive one
    await prisma.chatbot.update({
      where: { id: chatbotId },
      data: { apiKey: inactiveApiKey },
    });

    return NextResponse.json({
      message: 'API key deleted successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Delete API key error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting API key' },
      { status: 500 }
    );
  }
}

// Get API key for a chatbot
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    // In Next.js 15, params is a Promise that needs to be awaited
    const { id: chatbotId } = await params;

    // Check if chatbot exists and belongs to the user
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    if (chatbot.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to access this chatbot' },
        { status: 403 }
      );
    }

    // If API key exists, generate embed script
    let embedScript = null;
    if (chatbot.apiKey) {
      embedScript = `<script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://botfusion-ten.vercel.app'}/embed.js" data-chatbot-id="${chatbot.apiKey}"></script>`;
    }

    return NextResponse.json({
      apiKey: chatbot.apiKey,
      embedScript,
    }, { status: 200 });
  } catch (error) {
    console.error('Get API key error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching API key' },
      { status: 500 }
    );
  }
}