import { NextRequest, NextResponse } from 'next/server';

// Function to sanitize smart quotes and other problematic characters
function sanitizeQuotes(text: string): string {
  return text
    // Replace smart single quotes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    // Replace smart double quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Replace other quote-like characters
    .replace(/[\u00AB\u00BB]/g, '"') // Guillemets
    .replace(/[\u2039\u203A]/g, "'") // Single guillemets
    // Replace other problematic characters
    .replace(/[\u2013\u2014]/g, '-') // En dash and em dash
    .replace(/[\u2026]/g, '...') // Ellipsis
    .replace(/[\u00A0]/g, ' '); // Non-breaking space
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 });
    }

    // Validate URL format
    let validatedUrl: string;
    try {
      // Normalize URL by adding https if no protocol
      const normalizedUrl = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`;
      
      const urlObj = new URL(normalizedUrl);
      
      // Check for valid domain with at least one dot
      if (!urlObj.hostname.includes('.') || urlObj.hostname.length < 4) {
        return NextResponse.json({
          success: false,
          error: 'Invalid URL format. Please provide a valid website URL (e.g., firecrawl.dev, github.com)'
        }, { status: 400 });
      }
      
      validatedUrl = normalizedUrl;
    } catch (urlError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid URL format. Please provide a valid website URL (e.g., firecrawl.dev, github.com)'
      }, { status: 400 });
    }
    
    console.log('[scrape-url-enhanced] Scraping with Firecrawl:', validatedUrl);
    
    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set');
    }
    
    // Make request to Firecrawl API with maxAge for 500% faster scraping
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: validatedUrl,
        formats: ['markdown', 'html'],
        waitFor: 3000,
        timeout: 30000,
        blockAds: true,
        maxAge: 3600000, // Use cached data if less than 1 hour old (500% faster!)
        actions: [
          {
            type: 'wait',
            milliseconds: 2000
          }
        ]
      })
    });
    
    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      console.error('[scrape-url-enhanced] Firecrawl API error:', errorText);
      
      // Handle specific error cases
      if (firecrawlResponse.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Website not found (404). Please check the URL and try again.'
        }, { status: 404 });
      }
      
      if (firecrawlResponse.status === 403) {
        return NextResponse.json({
          success: false,
          error: 'Access forbidden. The website may be blocking automated access.'
        }, { status: 403 });
      }
      
      if (firecrawlResponse.status >= 500) {
        return NextResponse.json({
          success: false,
          error: 'The website is currently unavailable. Please try again later.'
        }, { status: 503 });
      }
      
      throw new Error(`Firecrawl API error: ${errorText}`);
    }
    
    const data = await firecrawlResponse.json();
    
    if (!data.success || !data.data) {
      throw new Error('Failed to scrape content');
    }
    
    const { markdown, html, metadata } = data.data;
    
    // Sanitize the markdown content
    const sanitizedMarkdown = sanitizeQuotes(markdown || '');
    
    // Extract structured data from the response
    const title = metadata?.title || '';
    const description = metadata?.description || '';
    
    // Format content for AI
    const formattedContent = `
Title: ${sanitizeQuotes(title)}
Description: ${sanitizeQuotes(description)}
URL: ${url}

Main Content:
${sanitizedMarkdown}
    `.trim();
    
    return NextResponse.json({
      success: true,
      url,
      content: formattedContent,
      structured: {
        title: sanitizeQuotes(title),
        description: sanitizeQuotes(description),
        content: sanitizedMarkdown,
        url
      },
      metadata: {
        scraper: 'firecrawl-enhanced',
        timestamp: new Date().toISOString(),
        contentLength: formattedContent.length,
        cached: data.data.cached || false, // Indicates if data came from cache
        ...metadata
      },
      message: 'URL scraped successfully with Firecrawl (with caching for 500% faster performance)'
    });
    
  } catch (error) {
    console.error('[scrape-url-enhanced] Error:', error);
    
    const errorMessage = (error as Error).message;
    
    // Handle network connectivity issues
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json({
        success: false,
        error: 'Unable to reach the website. Please check the URL and try again.'
      }, { status: 503 });
    }
    
    // Handle timeout issues
    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      return NextResponse.json({
        success: false,
        error: 'The website took too long to respond. Please try again.'
      }, { status: 408 });
    }
    
    // Handle certificate issues
    if (errorMessage.includes('certificate') || errorMessage.includes('SSL')) {
      return NextResponse.json({
        success: false,
        error: 'SSL certificate error. The website may have security issues.'
      }, { status: 502 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to scrape the website. Please try a different URL.'
    }, { status: 500 });
  }
}