import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
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

// Get all chatbots for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const chatbots = await prisma.chatbot.findMany({
      where: { userId },
      include: { trainingSources: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ chatbots });
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbots' },
      { status: 500 }
    );
  }
}

// Create a new chatbot
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Handle FormData instead of JSON
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const welcomeMessage = formData.get('welcomeMessage') as string;
    const colorScheme = formData.get('colorScheme') as string;
    const widgetPosition = formData.get('widgetPosition') as string;
    const logoFile = formData.get('logo') as File;
    
    let logoUrl = null;
    let logoImage = null;
    
    // Process logo file if provided
    if (logoFile) {
      // Process the logo file and get the buffer for MongoDB storage
      const imageBuffer = await processImageFile(logoFile);
      logoImage = imageBuffer;
      
      // We'll still set a logoUrl for backward compatibility
      // This can be a placeholder or identifier
      logoUrl = `mongodb-image-${Date.now()}`;
    }

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Chatbot name is required' },
        { status: 400 }
      );
    }

    // Generate a unique API key with a prefix to indicate it's inactive
    const inactiveApiKey = `inactive_${crypto.randomBytes(16).toString('hex')}`;
    
    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        welcomeMessage: welcomeMessage || 'Hello! How can I help you today?',
        logoUrl,
        logoImage,
        colorScheme: colorScheme || '#4F46E5',
        widgetPosition: widgetPosition || 'bottom-right',
        apiKey: inactiveApiKey, // Use an inactive key to satisfy unique constraint
        userId,
      },
    });

    return NextResponse.json({ chatbot }, { status: 201 });
  } catch (error) {
    console.error('Error creating chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to create chatbot' },
      { status: 500 }
    );
  }
}