import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Delete a specific training source
export async function DELETE(req: NextRequest, { params }: { params: { id: string, sourceId: string } }) {
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
    const { id: chatbotId, sourceId } = await params;

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

    // Check if training source exists and belongs to the chatbot
    const trainingSource = await prisma.trainingSource.findUnique({
      where: { id: sourceId },
    });

    if (!trainingSource) {
      return NextResponse.json(
        { error: 'Training source not found' },
        { status: 404 }
      );
    }

    if (trainingSource.chatbotId !== chatbotId) {
      return NextResponse.json(
        { error: 'Training source does not belong to this chatbot' },
        { status: 403 }
      );
    }

    // Delete the training source
    await prisma.trainingSource.delete({
      where: { id: sourceId },
    });

    return NextResponse.json({ message: 'Training source deleted successfully' });
  } catch (error) {
    console.error('Error deleting training source:', error);
    return NextResponse.json(
      { error: 'Failed to delete training source' },
      { status: 500 }
    );
  }
}