import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { savePDFFile } from '@/lib/pdf-processor';

// Handle PDF file uploads for chatbot training
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
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Check file size (limit to 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save the file
    const filePath = await savePDFFile(buffer, file.name, userId);

    // Create a training source record
    const trainingSource = await prisma.trainingSource.create({
      data: {
        type: 'pdf',
        filename: file.name,
        url: filePath, // Store the file path in the URL field
        status: 'pending',
        progress: 0,
        chatbotId,
      },
    });

    // In a real implementation, you would initiate the PDF processing here
    // For now, we'll simulate it by updating the status after a delay
    setTimeout(async () => {
      try {
        // Update to processing
        await prisma.trainingSource.update({
          where: { id: trainingSource.id },
          data: { status: 'processing', progress: 25 },
        });

        // Simulate processing time
        setTimeout(async () => {
          try {
            // Update progress
            await prisma.trainingSource.update({
              where: { id: trainingSource.id },
              data: { progress: 75 },
            });

            // Simulate completion
            setTimeout(async () => {
              try {
                await prisma.trainingSource.update({
                  where: { id: trainingSource.id },
                  data: { status: 'completed', progress: 100 },
                });
              } catch (error) {
                console.error('Error updating training source status:', error);
              }
            }, 5000);
          } catch (error) {
            console.error('Error updating training source progress:', error);
          }
        }, 5000);
      } catch (error) {
        console.error('Error updating training source status:', error);
      }
    }, 2000);

    return NextResponse.json({ 
      success: true,
      trainingSource
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}