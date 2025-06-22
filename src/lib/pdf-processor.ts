import fs from 'fs';
import path from 'path';
// Import types only, we'll dynamically import the actual module
type PDFParseResult = { text: string, numpages: number, info: any, metadata: any, version: string };
type PDFParse = (dataBuffer: Buffer, options?: any) => Promise<PDFParseResult>;

/**
 * Extracts text content from a PDF file
 * Note: This is a simplified implementation. For production use,
 * consider using a more robust PDF text extraction library like pdf.js or pdf-parse.
 * 
 * @param filePath Path to the PDF file
 * @returns Extracted text content
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Dynamically import pdf-parse to avoid loading test files during initialization
    const pdfParse = (await import('pdf-parse')).default as PDFParse;
    
    // Use pdf-parse to extract text
    const data = await pdfParse(dataBuffer);
    
    // Return the text content
    return data.text.trim();
  } catch (error : any) {
    console.error(`Error extracting text from PDF ${filePath}:`, error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Processes a PDF file for training
 * @param filePath Path to the PDF file
 * @returns Extracted text content
 */
export async function processPDFForTraining(filePath: string): Promise<string> {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Check if file is a PDF
    if (path.extname(filePath).toLowerCase() !== '.pdf') {
      throw new Error(`File is not a PDF: ${filePath}`);
    }
    
    // Extract text from the PDF
    const content = await extractTextFromPDF(filePath);
    
    return content;
  } catch (error) {
    console.error(`Error processing PDF ${filePath}:`, error);
    throw error;
  }
}

/**
 * Saves an uploaded PDF file to the server
 * @param buffer The file buffer
 * @param filename The original filename
 * @param userId The user ID
 * @returns Path to the saved file
 */
export async function savePDFFile(buffer: Buffer, filename: string, userId: string): Promise<string> {
  try {
    // Create directory for user uploads if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}-${sanitizedFilename}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Write the file
    fs.writeFileSync(filePath, buffer);
    
    return filePath;
  } catch (error : any) {
    console.error(`Error saving PDF file ${filename}:`, error);
    throw new Error(`Failed to save PDF file: ${error.message}`);
  }
}