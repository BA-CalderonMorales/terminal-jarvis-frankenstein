import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
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
          error: 'Invalid URL format. Please provide a valid website URL (e.g., firecrawl.dev, github.com)'
        }, { status: 400 });
      }
      
      validatedUrl = normalizedUrl;
    } catch (urlError) {
      return NextResponse.json({
        error: 'Invalid URL format. Please provide a valid website URL (e.g., firecrawl.dev, github.com)'
      }, { status: 400 });
    }

    // Use Firecrawl API to capture screenshot
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: validatedUrl,
        formats: ['screenshot'], // Regular viewport screenshot, not full page
        waitFor: 3000, // Wait for page to fully load
        timeout: 30000,
        blockAds: true,
        actions: [
          {
            type: 'wait',
            milliseconds: 2000 // Additional wait for dynamic content
          }
        ]
      })
    });

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      console.error('[scrape-screenshot] Firecrawl API error:', errorText);
      
      // Handle specific error cases
      if (firecrawlResponse.status === 404) {
        return NextResponse.json({
          error: 'Website not found (404). Please check the URL and try again.'
        }, { status: 404 });
      }
      
      if (firecrawlResponse.status === 403) {
        return NextResponse.json({
          error: 'Access forbidden. The website may be blocking automated access.'
        }, { status: 403 });
      }
      
      if (firecrawlResponse.status >= 500) {
        return NextResponse.json({
          error: 'The website is currently unavailable. Please try again later.'
        }, { status: 503 });
      }
      
      throw new Error(`Firecrawl API error: ${errorText}`);
    }

    const data = await firecrawlResponse.json();
    
    if (!data.success || !data.data?.screenshot) {
      throw new Error('Failed to capture screenshot');
    }

    return NextResponse.json({
      success: true,
      screenshot: data.data.screenshot,
      metadata: data.data.metadata
    });

  } catch (error: any) {
    console.error('Screenshot capture error:', error);
    
    const errorMessage = error.message || '';
    
    // Handle network connectivity issues
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json({
        error: 'Unable to reach the website. Please check the URL and try again.'
      }, { status: 503 });
    }
    
    // Handle timeout issues
    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      return NextResponse.json({
        error: 'The website took too long to respond. Please try again.'
      }, { status: 408 });
    }
    
    // Handle certificate issues
    if (errorMessage.includes('certificate') || errorMessage.includes('SSL')) {
      return NextResponse.json({
        error: 'SSL certificate error. The website may have security issues.'
      }, { status: 502 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to capture screenshot. Please try a different URL.' 
    }, { status: 500 });
  }
}