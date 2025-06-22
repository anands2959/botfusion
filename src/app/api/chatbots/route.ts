import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Function to save uploaded image file
async function saveImageFile(file: File, userId: string): Promise<string> {
  try {
    // Create directory for user uploads if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}-${sanitizedFilename}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Convert File to Buffer and write to filesystem
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    
    // Return the relative URL path for the file
    return `/uploads/${userId}/${uniqueFilename}`;
  } catch (error: any) {
    console.error(`Error saving image file ${file.name}:`, error);
    throw new Error(`Failed to save image file: ${error.message}`);
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
    
    // Process logo file if provided
    if (logoFile) {
      // Save the logo file and get the URL path
      logoUrl = await saveImageFile(logoFile, userId);
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