import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Get chatbot configuration for embedding
// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In Next.js 15, params is a Promise that needs to be awaited
    const { id: apiKey } = await params;

    // Find chatbot by API key
    const chatbot = await prisma.chatbot.findUnique({
      where: { apiKey },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { 
          status: 404,
          headers: corsHeaders()
        }
      );
    }

    // Return chatbot configuration for embedding with CORS headers
    return NextResponse.json({
      name: chatbot.name,
      welcomeMessage: chatbot.welcomeMessage,
      logoUrl: chatbot.logoUrl,
      colorScheme: chatbot.colorScheme,
      widgetPosition: chatbot.widgetPosition,
      userId: chatbot.userId, // Include userId in the response

    }, { 
      status: 200,
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('Embed API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching chatbot configuration' },
      { 
        status: 500,
        headers: corsHeaders()
      }
    );
  }
}
