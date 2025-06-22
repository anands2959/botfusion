import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

/**
 * Extracts all links from a webpage that belong to the same domain
 * @param url The URL to crawl
 * @param baseUrl The base URL to compare against
 * @returns Array of URLs found on the page that belong to the same domain
 */
export async function extractLinks(url: string, baseUrl: string): Promise<string[]> {
  try {
    // Add user-agent and timeout to avoid being blocked
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000 // 10 seconds timeout
    });
    const $ = cheerio.load(response.data);
    const links: string[] = [];
    
    // Parse the base URL to get the hostname
    const parsedBaseUrl = new URL(baseUrl);
    const baseHostname = parsedBaseUrl.hostname;
    
    // Extract all links from the page
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          // Handle relative URLs
          const absoluteUrl = new URL(href, url).href;
          const parsedUrl = new URL(absoluteUrl);
          
          // Only include links from the same domain
          if (parsedUrl.hostname === baseHostname) {
            // Remove hash and query parameters for deduplication
            const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;
            if (!links.includes(cleanUrl)) {
              links.push(cleanUrl);
            }
          }
        } catch (error) {
          // Skip invalid URLs
          console.error(`Invalid URL: ${href}`, error);
        }
      }
    });
    
    return links;
  } catch (error) {
    console.error(`Error extracting links from ${url}:`, error);
    return [];
  }
}

/**
 * Extracts text content from a webpage
 * @param url The URL to extract content from
 * @returns The extracted text content
 */
export async function extractContent(url: string): Promise<string> {
  try {
    // Add user-agent and timeout to avoid being blocked
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000 // 10 seconds timeout
    });
    const $ = cheerio.load(response.data);
    
    // Remove script, style, and other non-content elements
    $('script, style, meta, link, noscript, iframe, svg').remove();
    
    // Extract text from main content areas
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.main-content',
      '#content',
      '#main',
      '.post',
      '.entry',
      'body', // Fallback to body if nothing else works
    ];
    
    let content = '';
    let foundSpecificContent = false;
    
    // Try to find specific content containers first
    for (const selector of contentSelectors) {
      if ($(selector).length > 0) {
        content += $(selector).text().trim() + '\n\n';
        foundSpecificContent = true;
      }
    }
    
    // If no specific content containers found, extract from body
    if (!foundSpecificContent) {
      // Extract text from paragraphs, headings, and list items
      $('h1, h2, h3, h4, h5, h6, p, li').each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          content += text + '\n\n';
        }
      });
    }
    
    // Clean up the content
    return content
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();
  } catch (error) {
    console.error(`Error extracting content from ${url}:`, error);
    return '';
  }
}

/**
 * Crawls a website starting from a URL and extracts content from all pages
 * @param startUrl The URL to start crawling from
 * @param maxPages Maximum number of pages to crawl
 * @param progressCallback Optional callback function to report progress during crawling
 * @returns Object containing all extracted content and visited URLs
 */
export async function crawlWebsite(
  startUrl: string, 
  maxPages: number = 10, 
  progressCallback?: (progress: number, currentUrl: string) => Promise<void>
): Promise<{ content: string, urls: string[], pageContents: { [url: string]: string } }> {
  // Validate the URL format before proceeding
  try {
    new URL(startUrl);
  } catch (error) {
    console.error(`Invalid URL format: ${startUrl}`);
    throw new Error(`Invalid URL format: ${startUrl}. Please ensure the URL includes the protocol (http:// or https://).`);
  }

  const visited: Set<string> = new Set();
  const queue: string[] = [startUrl];
  let content = '';
  const pageContents: { [url: string]: string } = {};
  let failedAttempts = 0;
  const maxFailedAttempts = 5; // Maximum number of consecutive failed attempts before giving up
  
  // Normalize the start URL
  const baseUrl = new URL(startUrl).origin;
  
  // Add special pages to crawl (terms, privacy, about, etc.)
  const specialPaths = [
    '/terms', '/terms-of-service', '/terms-and-conditions', '/tos',
    '/privacy', '/privacy-policy',
    '/about', '/about-us',
    '/contact', '/contact-us',
    '/faq', '/help'
  ];
  
  // Add special pages to the queue
  for (const path of specialPaths) {
    try {
      const specialUrl = new URL(path, startUrl).href;
      if (!queue.includes(specialUrl)) {
        queue.push(specialUrl);
      }
    } catch (error) {
      console.error(`Error creating URL for ${path}:`, error);
    }
  }
  
  // First try to extract content from the start URL to verify it's accessible
  try {
    const initialContent = await extractContent(startUrl);
    if (!initialContent) {
      console.warn(`Warning: Could not extract content from the initial URL: ${startUrl}`);
      // We'll continue anyway as some sites might return empty content but still be crawlable
    }
  } catch (error) {
    console.error(`Error accessing the initial URL ${startUrl}:`, error);
    throw new Error(`Failed to access the website at ${startUrl}. Please check the URL and ensure the website is accessible.`);
  }
  
  while (queue.length > 0 && visited.size < maxPages && failedAttempts < maxFailedAttempts) {
    const currentUrl = queue.shift()!;
    
    // Skip if already visited
    if (visited.has(currentUrl)) {
      continue;
    }
    
    console.log(`Crawling: ${currentUrl}`);
    visited.add(currentUrl);
    
    // Calculate and report progress
    const progress = Math.round((visited.size / maxPages) * 100);
    if (progressCallback) {
      await progressCallback(progress, currentUrl);
    }
    
    try {
      // Extract content from the current page
      const pageContent = await extractContent(currentUrl);
      content += `\n\n--- Content from ${currentUrl} ---\n\n${pageContent}`;
      
      // Store the content for this specific URL
      pageContents[currentUrl] = pageContent;
      
      // Extract links from the current page
      const links = await extractLinks(currentUrl, baseUrl);
      
      // Add new links to the queue
      for (const link of links) {
        if (!visited.has(link) && !queue.includes(link)) {
          queue.push(link);
        }
      }
      
      // Reset failed attempts counter on success
      failedAttempts = 0;
    } catch (error) {
      console.error(`Error processing ${currentUrl}:`, error);
      failedAttempts++;
      
      // If we've had too many consecutive failures, break the loop
      if (failedAttempts >= maxFailedAttempts) {
        console.error(`Too many consecutive failures (${failedAttempts}). Stopping crawl.`);
        break;
      }
    }
  }
  
  // Final progress update (100%)
  if (progressCallback) {
    await progressCallback(100, 'Crawling completed');
  }
  
  return {
    content,
    urls: Array.from(visited),
    pageContents
  };
}