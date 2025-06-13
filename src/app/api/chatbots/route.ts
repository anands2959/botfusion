import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

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
      // In a real implementation, you would upload the file to storage
      // and get a URL. For now, we'll just use a placeholder
      logoUrl = `/uploads/${userId}/${Date.now()}_${logoFile.name}`;
      
      // Here you would add code to actually save the file
      // For example: await saveFile(logoFile, logoUrl);
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