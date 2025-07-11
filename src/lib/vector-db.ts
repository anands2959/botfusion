// import { prisma } from './prisma';
// import { OpenAI } from 'openai';
// // import { Anthropic } from '@anthropic-ai/sdk';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // interface EmbeddingResult {
// //   id: string;
// //   embedding: number[];
// //   content: string;
// //   metadata: {
// //     sourceId: string;
// //     chatbotId: string;
// //     sourceType: string;
// //     filename?: string;
// //     url?: string;
// //   };
// // }

// /**
//  * Generates embeddings for text content using the specified AI provider
//  * @param content Text content to generate embeddings for
//  * @param provider AI provider (openai, anthropic, google, deepseek)
//  * @param apiKey API key for the provider
//  * @returns Array of embeddings
//  */
// export async function generateEmbeddings(
//   content: string,
//   provider: string,
//   apiKey: string
// ): Promise<number[]> {
//   try {
//     console.log(`Generating embeddings with provider: ${provider}`);

//     // Split content into chunks if it's too large
//     const chunks = splitContentIntoChunks(content);

//     // For simplicity, we'll just use the first chunk in this implementation
//     // In a production environment, you would process all chunks and combine or store them separately
//     const chunk = chunks[0];
//     console.log(`Content chunk length: ${chunk.length} characters`);

//     switch (provider) {
//       case 'openai': {
//         const openai = new OpenAI({ apiKey });
//         const response = await openai.embeddings.create({
//           model: 'text-embedding-ada-002',
//           input: chunk,
//         });
//         return response.data[0].embedding;
//       }
//       case 'google': {
//         // Using Google's embedding API
//         const genAI = new GoogleGenerativeAI(apiKey);
//         const model = genAI.getGenerativeModel({ model: 'embedding-001' });
//         const result = await model.embedContent(chunk);
//         return result.embedding.values;
//       }
//       case 'gemini': {
//         // Using Google's embedding API for Gemini
//         const genAI = new GoogleGenerativeAI(apiKey);
//         const model = genAI.getGenerativeModel({ model: 'embedding-001' });
//         const result = await model.embedContent(chunk);
//         return result.embedding.values;
//       }
//       case 'chatgpt': {
//         // Map chatgpt to OpenAI's embedding API
//         const openai = new OpenAI({ apiKey });
//         const response = await openai.embeddings.create({
//           model: 'text-embedding-ada-002',
//           input: chunk,
//         });
//         return response.data[0].embedding;
//       }
//       case 'openrouter': {
//         if (apiKey.startsWith('sk-or-')) {
//           throw new Error('OpenRouter does not support embeddings. Use OpenAI key for fallback.');
//         }

//         console.log('Using OpenAI embeddings API as fallback for OpenRouter');
//         const openai = new OpenAI({ apiKey }); // will default to https://api.openai.com/v1
//         const response = await openai.embeddings.create({
//           model: 'text-embedding-ada-002',
//           input: chunk,
//         });
//         return response.data[0].embedding;

//       }
//       default: {
//         throw new Error(`Unsupported provider: ${provider}`);
//       }
//     }
//   } catch (error: any) {
//     console.error(`Error generating embeddings: ${error.message}`);
//     throw new Error(`Failed to generate embeddings: ${error.message}`);
//   }
// }

// /**
//  * Splits content into chunks of appropriate size for embedding
//  * @param content Text content to split
//  * @param maxChunkSize Maximum size of each chunk (default: 4000 characters)
//  * @returns Array of content chunks
//  */
// function splitContentIntoChunks(content: string, maxChunkSize = 4000): string[] {
//   const chunks: string[] = [];

//   // Simple chunking by character count
//   // In a production environment, you would use more sophisticated chunking
//   // that respects sentence and paragraph boundaries
//   for (let i = 0; i < content.length; i += maxChunkSize) {
//     chunks.push(content.substring(i, i + maxChunkSize));
//   }

//   return chunks;
// }

// /**
//  * Stores embeddings in the database
//  * @param embeddings Embedding vectors
//  * @param content Original text content
//  * @param sourceId ID of the training source
//  * @param chatbotId ID of the chatbot
//  * @param sourceType Type of source (website, pdf)
//  * @param metadata Additional metadata
//  * @returns ID of the stored embedding
//  */
// export async function storeEmbeddings(
//   embeddings: number[],
//   content: string,
//   sourceId: string,
//   chatbotId: string,
//   sourceType: string,
//   metadata: { filename?: string; url?: string }
// ): Promise<string> {
//   try {
//     // In a production environment, you would use a vector database like Pinecone, Weaviate, or Milvus
//     // For this implementation, we'll store the embeddings in MongoDB using Prisma
//     // Note: MongoDB is not optimized for vector search, but it can work for demonstration purposes

//     const embeddingRecord = await prisma.embedding.create({
//       data: {
//         vector: embeddings,
//         content,
//         trainingSourceId: sourceId,
//         chatbotId,
//         sourceType,
//         filename: metadata.filename,
//         url: metadata.url,
//       },
//     });

//     return embeddingRecord.id;
//   } catch (error: any) {
//     console.error(`Error storing embeddings: ${error.message}`);
//     throw new Error(`Failed to store embeddings: ${error.message}`);
//   }
// }

// /**
//  * Searches for relevant content based on a query
//  * @param query User's query
//  * @param chatbotId ID of the chatbot
//  * @param provider AI provider (openai, anthropic, google, deepseek)
//  * @param apiKey API key for the provider
//  * @returns Array of relevant content chunks with similarity scores
//  */
// export async function searchSimilarContent(
//   query: string,
//   chatbotId: string,
//   provider: string,
//   apiKey: string
// ): Promise<{ content: string; similarity: number; metadata: any }[]> {
//   try {
//     console.log(`Searching similar content for chatbot: ${chatbotId}`);
//     console.log(`Query: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`);

//     // Generate embeddings for the query
//     const queryEmbedding = await generateEmbeddings(query, provider, apiKey);
//     console.log(`Generated query embedding with length: ${queryEmbedding.length}`);

//     // Get all embeddings for this chatbot
//     const storedEmbeddings = await prisma.embedding.findMany({
//       where: { chatbotId },
//     });

//     console.log(`Found ${storedEmbeddings.length} stored embeddings for this chatbot`);

//     if (storedEmbeddings.length === 0) {
//       console.log('No embeddings found, returning empty results');
//       return [];
//     }

//     // Calculate cosine similarity between query and stored embeddings
//     const results = storedEmbeddings.map(embedding => {
//       const similarity = calculateCosineSimilarity(queryEmbedding, embedding.vector);
//       return {
//         content: embedding.content,
//         similarity,
//         metadata: {
//           sourceId: embedding.trainingSourceId,
//           sourceType: embedding.sourceType,
//           filename: embedding.filename,
//           url: embedding.url,
//         },
//       };
//     });

//     // Sort by similarity (highest first)
//     results.sort((a, b) => b.similarity - a.similarity);

//     // Log similarity scores of top results
//     console.log('Top similarity scores:', results.slice(0, 5).map(r => r.similarity));

//     // Return top 5 results
//     return results.slice(0, 5);
//   } catch (error: any) {
//     console.error(`Error searching similar content: ${error.message}`);
//     throw new Error(`Failed to search similar content: ${error.message}`);
//   }
// }

// /**
//  * Calculates cosine similarity between two vectors
//  * @param vecA First vector
//  * @param vecB Second vector
//  * @returns Cosine similarity (between -1 and 1, higher is more similar)
//  */
// function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
//   // Ensure vectors are of the same length
//   if (vecA.length !== vecB.length) {
//     throw new Error('Vectors must be of the same length');
//   }

//   // Calculate dot product
//   let dotProduct = 0;
//   let normA = 0;
//   let normB = 0;

//   for (let i = 0; i < vecA.length; i++) {
//     dotProduct += vecA[i] * vecB[i];
//     normA += vecA[i] * vecA[i];
//     normB += vecB[i] * vecB[i];
//   }

//   // Calculate magnitude
//   normA = Math.sqrt(normA);
//   normB = Math.sqrt(normB);

//   // Calculate cosine similarity
//   if (normA === 0 || normB === 0) {
//     return 0; // Avoid division by zero
//   }

//   return dotProduct / (normA * normB);
// }

import { prisma } from './prisma';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generates embeddings for text content using the specified AI provider
 */
export async function generateEmbeddings(
  content: string,
  provider: string,
  apiKey: string
): Promise<number[]> {
  try {
    console.log(`Generating embeddings with provider: ${provider}`);

    const chunks = splitContentIntoChunks(content);
    const chunk = chunks[0];
    console.log(`Content chunk length: ${chunk.length} characters`);

    switch (provider) {
      case 'openai':
      case 'chatgpt': {
        const openai = new OpenAI({ apiKey, baseURL: 'https://api.openai.com/v1' });
        const response = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: chunk,
        });
        return response.data[0].embedding;
      }

      case 'google':
      case 'gemini': {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });
        const result = await model.embedContent(chunk);
        return result.embedding.values;
      }

      case 'openrouter': {
        const openai = new OpenAI({
          apiKey,
          baseURL: 'https://openrouter.ai/api/v1',
        });
        const response = await openai.embeddings.create({
          model: 'openai/text-embedding-ada-002',
          input: chunk,
        });
        return response.data[0].embedding;
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error: any) {
    console.error(`Error generating embeddings: ${error.message}`);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

function splitContentIntoChunks(content: string, maxChunkSize = 4000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < content.length; i += maxChunkSize) {
    chunks.push(content.substring(i, i + maxChunkSize));
  }
  return chunks;
}

export async function storeEmbeddings(
  embeddings: number[],
  content: string,
  sourceId: string,
  chatbotId: string,
  sourceType: string,
  metadata: { filename?: string; url?: string }
): Promise<string> {
  try {
    const embeddingRecord = await prisma.embedding.create({
      data: {
        vector: embeddings,
        content,
        trainingSourceId: sourceId,
        chatbotId,
        sourceType,
        filename: metadata.filename,
        url: metadata.url,
      },
    });
    return embeddingRecord.id;
  } catch (error: any) {
    console.error(`Error storing embeddings: ${error.message}`);
    throw new Error(`Failed to store embeddings: ${error.message}`);
  }
}

export async function searchSimilarContent(
  query: string,
  chatbotId: string,
  provider: string,
  apiKey: string
): Promise<{ content: string; similarity: number; metadata: any }[]> {
  try {
    console.log(`Searching similar content for chatbot: ${chatbotId}`);
    console.log(`Query: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`);

    const queryEmbedding = await generateEmbeddings(query, provider, apiKey);
    console.log(`Generated query embedding with length: ${queryEmbedding.length}`);

    const storedEmbeddings = await prisma.embedding.findMany({
      where: { chatbotId },
    });
    console.log(`Found ${storedEmbeddings.length} stored embeddings for this chatbot`);

    if (storedEmbeddings.length === 0) {
      console.log('No embeddings found, returning empty results');
      return [];
    }

    const results = storedEmbeddings.map(embedding => {
      const similarity = calculateCosineSimilarity(queryEmbedding, embedding.vector);
      return {
        content: embedding.content,
        similarity,
        metadata: {
          sourceId: embedding.trainingSourceId,
          sourceType: embedding.sourceType,
          filename: embedding.filename,
          url: embedding.url,
        },
      };
    });

    results.sort((a, b) => b.similarity - a.similarity);
    console.log('Top similarity scores:', results.slice(0, 5).map(r => r.similarity));

    return results.slice(0, 5);
  } catch (error: any) {
    console.error(`Error searching similar content: ${error.message}`);
    throw new Error(`Failed to search similar content: ${error.message}`);
  }
}

function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  return normA === 0 || normB === 0 ? 0 : dotProduct / (normA * normB);
}
