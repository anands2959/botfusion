import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

// Serve static files from the uploads directory
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Get the path from the URL
    const filePath = path.join(process.cwd(), 'uploads', ...params.path);
    
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
  } catch (error: any) {
    console.error(`Error serving file:`, error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}