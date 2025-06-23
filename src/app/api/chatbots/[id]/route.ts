import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Function to process uploaded image file and return buffer for MongoDB storage
async function processImageFile(file: File): Promise<Buffer> {
  try {
    // Convert File to Buffer for MongoDB storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error: any) {
    console.error(`Error processing image file ${file.name}:`, error);
    throw new Error(`Failed to process image file: ${error.message}`);
  }
}

// Get a specific chatbot by ID
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

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: { trainingSources: true },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    // Ensure the chatbot belongs to the authenticated user
    if (chatbot.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ chatbot });
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbot' },
      { status: 500 }
    );
  }
}

// Update a chatbot
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
    
    // Handle FormData instead of JSON
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const welcomeMessage = formData.get('welcomeMessage') as string;
    const colorScheme = formData.get('colorScheme') as string;
    const widgetPosition = formData.get('widgetPosition') as string;
    const logoFile = formData.get('logo') as File;
    
    // Check if chatbot exists and belongs to the user
    const existingChatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!existingChatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    if (existingChatbot.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    let logoUrl = existingChatbot.logoUrl;
    let logoImage = existingChatbot.logoImage;
    
    // Process logo file if provided
    if (logoFile) {
      // Process the logo file and get the buffer for MongoDB storage
      const imageBuffer = await processImageFile(logoFile);
      logoImage = imageBuffer;
      
      // We'll still set a logoUrl for backward compatibility
      // This can be a placeholder or identifier
      logoUrl = `mongodb-image-${Date.now()}`;
    }

    // Update the chatbot
    const updatedChatbot = await prisma.chatbot.update({
      where: { id: chatbotId },
      data: {
        name: name || existingChatbot.name,
        welcomeMessage: welcomeMessage || existingChatbot.welcomeMessage,
        logoUrl: logoUrl,
        logoImage: logoImage,
        colorScheme: colorScheme || existingChatbot.colorScheme,
        widgetPosition: widgetPosition || existingChatbot.widgetPosition,
      },
    });

    return NextResponse.json({ chatbot: updatedChatbot });
  } catch (error) {
    console.error('Error updating chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to update chatbot' },
      { status: 500 }
    );
  }
}

// Delete a chatbot
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
    const existingChatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!existingChatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }

    if (existingChatbot.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the chatbot (this will also delete associated training sources due to cascade)
    await prisma.chatbot.delete({
      where: { id: chatbotId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to delete chatbot' },
      { status: 500 }
    );
  }
}