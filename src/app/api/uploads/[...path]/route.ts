import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// Map file extensions to MIME types
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.json': 'application/json',
};

// Serve files from the uploads directory or MongoDB
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Join the path segments
    const pathSegments = params.path;
    const joinedPath = pathSegments.join('/');
    
    // Check if this is a MongoDB image request
    if (joinedPath.includes('mongodb-image-')) {
      // Extract the timestamp from the URL
      const timestamp = joinedPath.match(/mongodb-image-(\d+)/);
      if (!timestamp) {
        return NextResponse.json({ error: 'Invalid MongoDB image URL' }, { status: 400 });
      }
      
      // Get the user ID from the path (assuming it's the first segment)
      const userId = pathSegments[0];
      
      // Find the chatbot with this logoUrl pattern
      const chatbot = await prisma.chatbot.findFirst({
        where: {
          userId,
          logoUrl: { contains: `mongodb-image-${timestamp[1]}` }
        }
      });
      
      if (!chatbot || !chatbot.logoImage) {
        return NextResponse.json({ error: 'Image not found in database' }, { status: 404 });
      }
      
      // Determine the content type (default to JPEG if unknown)
      const contentType = 'image/jpeg';
      
      // Return the image from MongoDB
      return new NextResponse(chatbot.logoImage, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        },
      });
    } else {
      // This is a regular file system request
      const filePath = path.join(process.cwd(), 'uploads', ...pathSegments);
      
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      // Read the file
      const fileBuffer = fs.readFileSync(filePath);
      
      // Determine the MIME type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      // Return the file with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        },
      });
    }
  } catch (error: any) {
    console.error(`Error serving file:`, error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}