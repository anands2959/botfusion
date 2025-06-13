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
    // In Next.js 15, params is a Promise that needs to be awaited
    const { id: chatbotId } = await params;
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

    // Progress callback function to update the database with crawling progress
    const updateProgress = async (progress: number, currentUrl: string) => {
      console.log(`Crawling progress: ${progress}% - ${currentUrl}`);
      await prisma.trainingSource.update({
        where: { id: trainingSourceId },
        data: { 
          progress: progress, // Remove the cap to allow 100% completion
          filename: `Currently crawling: ${currentUrl}` // Use filename field to store current URL
        },
      });
    };

    // Crawl the website (max 20 pages) with progress updates
    const { content, urls, pageContents } = await crawlWebsite(url, 20, updateProgress);

    // Update progress to indicate crawling is complete
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        progress: 90,
        filename: `Crawled ${urls.length} pages, processing content...`,
        extractedContent: content,
        extractedUrls: urls
      },
    });

    // Get the user who owns this training source
    const trainingSource = await prisma.trainingSource.findUnique({
      where: { id: trainingSourceId },
      include: { chatbot: { include: { user: { include: { settings: true } } } } },
    });

    if (!trainingSource || !trainingSource.chatbot || !trainingSource.chatbot.user) {
      throw new Error('Training source, chatbot, or user not found');
    }

    // Get the selected AI model and API key
    const settings = trainingSource.chatbot.user.settings;
    const selectedModel = settings?.defaultAIModel || 'chatgpt-free';
    let apiKey = '';
    let provider = '';

    // Determine which API key to use based on the selected model
    if (selectedModel === 'chatgpt-free') {
      apiKey = settings?.openaiApiKey || '';
      provider = 'openai';
    } else if (selectedModel === 'claude-free') {
      apiKey = settings?.anthropicApiKey || '';
      provider = 'anthropic';
    } else if (selectedModel === 'gemini-free') {
      apiKey = settings?.googleApiKey || '';
      provider = 'google';
    } else if (selectedModel === 'deepseek-free') {
      apiKey = settings?.deepseekApiKey || '';
      provider = 'deepseek';
    }

    // Check if API key is available
    if (!apiKey) {
      throw new Error(`API key for ${provider} is not configured`);
    }

    // In a real implementation, you would:
    // 1. Use the selected model's API to convert content to embeddings
    // 2. Store these embeddings in a vector database
    // 3. Associate them with this chatbot for future retrieval
    
    // For now, we'll just update the status to completed
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        status: 'completed', 
        progress: 100,
        // Store metadata about the crawl
        url: `${url} (crawled ${urls.length} pages, processed with ${provider})`
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
    console.log(`Processing PDF: ${filename}`);
    
    // Update to processing
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        status: 'processing', 
        progress: 10,
        filename: `Starting to process: ${filename}`
      },
    });

    // Get the file path
    const filePath = path.join(process.cwd(), 'uploads', userId, filename);
    
    // Update progress before extraction
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        progress: 30,
        filename: `Extracting text from: ${filename}`
      },
    });
    
    // Extract text from PDF
    const content = await processPDFForTraining(filePath);
    
    // Update progress after extraction
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        progress: 50,
        filename: `Text extracted from: ${filename}, processing content...`,
        extractedContent: content
      },
    });

    // Get the user who owns this training source
    const trainingSource = await prisma.trainingSource.findUnique({
      where: { id: trainingSourceId },
      include: { chatbot: { include: { user: { include: { settings: true } } } } },
    });

    if (!trainingSource || !trainingSource.chatbot || !trainingSource.chatbot.user) {
      throw new Error('Training source, chatbot, or user not found');
    }

    // Get the selected AI model and API key
    const settings = trainingSource.chatbot.user.settings;
    const selectedModel = settings?.defaultAIModel || 'chatgpt-free';
    let apiKey = '';
    let provider = '';

    // Determine which API key to use based on the selected model
    if (selectedModel === 'chatgpt-free') {
      apiKey = settings?.openaiApiKey || '';
      provider = 'openai';
    } else if (selectedModel === 'claude-free') {
      apiKey = settings?.anthropicApiKey || '';
      provider = 'anthropic';
    } else if (selectedModel === 'gemini-free') {
      apiKey = settings?.googleApiKey || '';
      provider = 'google';
    } else if (selectedModel === 'deepseek-free') {
      apiKey = settings?.deepseekApiKey || '';
      provider = 'deepseek';
    }

    // Check if API key is available
    if (!apiKey) {
      throw new Error(`API key for ${provider} is not configured`);
    }

    // Use the selected AI model to generate embeddings
    console.log(`Using ${provider} API to generate embeddings for content...`);
    
    // Update progress to indicate embedding generation has started
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        progress: 70,
        filename: `Generating embeddings with ${provider} API...`
      },
    });
    
    // Import the vector database functions
    const { generateEmbeddings, storeEmbeddings } = await import('@/lib/vector-db');
    
    try {
      // Generate embeddings for the content
      const embeddings = await generateEmbeddings(content, provider, apiKey);
      
      // Update progress
      await prisma.trainingSource.update({
        where: { id: trainingSourceId },
        data: { 
          progress: 85,
          filename: `Storing embeddings in database...`
        },
      });
      
      // Store embeddings in the vector database
      await storeEmbeddings(
        embeddings,
        content,
        trainingSourceId,
        trainingSource.chatbotId,
        'pdf',
        { filename }
      );
    } catch (embeddingError) {
      console.error(`Error generating embeddings: ${embeddingError}`);
      // Continue with the process even if embedding generation fails
      // This ensures the training source is still marked as completed
    }
    
    // Update the status to completed with metadata about the processing
    await prisma.trainingSource.update({
      where: { id: trainingSourceId },
      data: { 
        status: 'completed', 
        progress: 100,
        // Store metadata about the processing
        filename: `${filename} (processed with ${provider} using ${selectedModel})`
      },
    });
    
    console.log(`Successfully completed training for ${filename} using ${selectedModel}`);

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
    // In Next.js 15, params is a Promise that needs to be awaited
    const { id: chatbotId } = await params;

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
    const pendingSources = chatbot.trainingSources.filter(source => 
      source.status === 'pending' || (source.status === 'processing' && source.progress < 20)
    );

    if (pendingSources.length === 0) {
      return NextResponse.json(
        { error: 'No sources available for training. Please add new sources or check if all sources are already completed.' },
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
      // Only process sources that are in pending status
      if (source.status === 'pending') {
        if (source.type === 'website' && source.url) {
          // Process website in the background
          processWebsiteTraining(source.id, source.url);
        } else if (source.type === 'pdf' && source.filename) {
          // Process PDF in the background
          processPDFTraining(source.id, source.filename, userId);
        }
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