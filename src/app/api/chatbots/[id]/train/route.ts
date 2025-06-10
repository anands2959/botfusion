import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { crawlWebsite } from '@/lib/crawler';
import { processPDFForTraining } from '@/lib/pdf-processor';
import path from 'path';

// Add a training source (website URL or PDF) to a chatbot
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
    const chatbotId = params.id;
    const { type, url, filename } = await req.json();

    // Validate input
    if (!type || (type !== 'website' && type !== 'pdf')) {
      return NextResponse.json(
        { error: 'Invalid source type. Must be "website" or "pdf"' },
        { status: 400 }
      );
    }

    if (type === 'website' && !url) {
      return NextResponse.json(
        { error: 'URL is required for website sources' },
        { status: 400 }
      );
    }

    if (type === 'pdf' && !filename) {
      return NextResponse.json(
        { error: 'Filename is required for PDF sources' },
        { status: 400 }
      );
    }

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
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create the training source
    const trainingSource = await prisma.trainingSource.create({
      data: {
        type,
        url: type === 'website' ? url : undefined,
        filename: type === 'pdf' ? filename : undefined,
        status: 'pending',
        progress: 0,
        chatbotId,
      },
    });

    // Start the training process asynchronously
    if (type === 'website') {
      // Process website in the background
      processWebsiteTraining(trainingSource.id, url);
    } else if (type === 'pdf') {
      // Process PDF in the background
      processPDFTraining(trainingSource.id, filename, userId);
    }

    return NextResponse.json({ trainingSource }, { status: 201 });
  } catch (error) {
    console.error('Error adding training source:', error);
    return NextResponse.json(
      { error: 'Failed to add training source' },
      { status: 500 }
    );
  }
}

// Process website training asynchronously
async function processWebsiteTraining(trainingSourceId: string, url: string) {
  try {
    // Update to processing
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { status: 'processing', progress: 10 },
    });

    // Crawl the website (max 20 pages)
    const { content, urls } = await crawlWebsite(url, 20);

    // Update progress
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { progress: 50 },
    });

    // In a real implementation, you would process and store the content
    // For now, we'll just update the status to completed
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        status: 'completed', 
        progress: 100,
        // Store metadata about the crawl
        url: `${url} (crawled ${urls.length} pages)`
      },
    });

    console.log(`Successfully processed website: ${url}`);
  } catch (error) {
    console.error(`Error processing website ${url}:`, error);
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { status: 'failed', progress: 0 },
    });
  }
}

// Process PDF training asynchronously
async function processPDFTraining(trainingSourceId: string, filename: string, userId: string) {
  try {
    // Update to processing
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { status: 'processing', progress: 10 },
    });

    // Construct the file path
    const filePath = path.join(process.cwd(), 'uploads', userId, filename);

    // Process the PDF
    const content = await processPDFForTraining(filePath);

    // Update progress
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { progress: 50 },
    });

    // In a real implementation, you would process and store the content
    // For now, we'll just update the status to completed
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { status: 'completed', progress: 100 },
    });

    console.log(`Successfully processed PDF: ${filename}`);
  } catch (error) {
    console.error(`Error processing PDF ${filename}:`, error);
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { status: 'failed', progress: 0 },
    });
  }
}

// Start training process for all pending sources
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
    // Make sure to await params.id before using it
    const chatbotId = await params.id;

    // Check if chatbot exists and belongs to the user
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

    if (chatbot.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all pending training sources
    const pendingSources = chatbot.trainingSources.filter(source => source.status === 'pending');

    if (pendingSources.length === 0) {
      return NextResponse.json(
        { error: 'No pending training sources found' },
        { status: 400 }
      );
    }

    // Update all pending sources to processing
    await prisma.trainingSource.updateMany({
      where: { 
        chatbotId,
        status: 'pending'
      },
      data: { 
        status: 'processing',
        progress: 10
      },
    });

    // Process each source
    for (const source of pendingSources) {
      if (source.type === 'website' && source.url) {
        // Process website in the background
        processWebsiteTraining(source.id, source.url);
      } else if (source.type === 'pdf' && source.filename) {
        // Process PDF in the background
        processPDFTraining(source.id, source.filename, userId);
      }
    }

    return NextResponse.json({ 
      message: 'Training process started',
      processingCount: pendingSources.length
    });
  } catch (error) {
    console.error('Error starting training process:', error);
    return NextResponse.json(
      { error: 'Failed to start training process' },
      { status: 500 }
    );
  }
}

// Get training status for a chatbot
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
    // Make sure to await params.id before using it
    const chatbotId = await params.id;

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
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all training sources for the chatbot
    const trainingSources = await prisma.trainingSource.findMany({
      where: { chatbotId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate overall training status
    const totalSources = trainingSources.length;
    const completedSources = trainingSources.filter(source => source.status === 'completed').length;
    const failedSources = trainingSources.filter(source => source.status === 'failed').length;
    const processingSources = trainingSources.filter(source => source.status === 'processing').length;
    const pendingSources = trainingSources.filter(source => source.status === 'pending').length;

    // Calculate overall progress
    const overallProgress = totalSources > 0
      ? Math.round(trainingSources.reduce((sum, source) => sum + source.progress, 0) / totalSources)
      : 0;

    return NextResponse.json({
      trainingSources,
      stats: {
        total: totalSources,
        completed: completedSources,
        failed: failedSources,
        processing: processingSources,
        pending: pendingSources,
        overallProgress,
      },
    });
  } catch (error) {
    console.error('Error fetching training status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training status' },
      { status: 500 }
    );
  }
}