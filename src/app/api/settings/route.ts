import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

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

    // Get user with settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If settings don't exist, create default settings
    if (!user.settings) {
      const settings = await prisma.settings.create({
        data: {
          userId,
          defaultAIModel: 'chatgpt-pro',
        },
      });

      return NextResponse.json({ settings }, { status: 200 });
    }

    return NextResponse.json({ settings: user.settings }, { status: 200 });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const data = await req.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update or create settings
    let settings;
    if (user.settings) {
      settings = await prisma.settings.update({
        where: { userId },
        data,
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          userId,
          ...data,
        },
      });
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating settings' },
      { status: 500 }
    );
  }
}