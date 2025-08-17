import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({
        isValid: false,
        error: 'URL is required'
      }, { status: 400 });
    }

    // Normalize URL by adding https if no protocol
    let normalizedUrl: string;
    try {
      const trimmed = url.trim();
      normalizedUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
        ? trimmed 
        : `https://${trimmed}`;
      
      const urlObj = new URL(normalizedUrl);
      
      // Check for valid domain with at least one dot
      if (!urlObj.hostname.includes('.') || urlObj.hostname.length < 4) {
        return NextResponse.json({
          isValid: false,
          error: 'Invalid URL format. Please provide a valid website URL (e.g., firecrawl.dev, github.com)'
        });
      }
    } catch (urlError) {
      return NextResponse.json({
        isValid: false,
        error: 'Invalid URL format. Please provide a valid website URL (e.g., firecrawl.dev, github.com)'
      });
    }

    // Test both HTTPS and HTTP if HTTPS fails
    const urlsToTest = [normalizedUrl];
    
    // If the normalized URL is HTTPS, also try HTTP as fallback
    if (normalizedUrl.startsWith('https://')) {
      const httpUrl = normalizedUrl.replace('https://', 'http://');
      urlsToTest.push(httpUrl);
    }

    let lastError = '';
    
    for (const testUrl of urlsToTest) {
      try {
        // Use a lightweight HEAD request first, then fallback to GET
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        let response;
        try {
          // Try HEAD request first (faster)
          response = await fetch(testUrl, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Terminal-Jarvis-Frankenstein/1.0 (Website-Cloning-Tool)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            }
          });
        } catch (headError) {
          // If HEAD fails, try GET request with limited content
          response = await fetch(testUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Terminal-Jarvis-Frankenstein/1.0 (Website-Cloning-Tool)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Range': 'bytes=0-1023' // Only get first 1KB
            }
          });
        }
        
        clearTimeout(timeoutId);
        
        // Consider 2xx, 3xx, and even some 4xx as "accessible" 
        // (site exists but might have restrictions)
        if (response.status < 500) {
          return NextResponse.json({
            isValid: true,
            finalUrl: testUrl,
            statusCode: response.status
          });
        }
        
        lastError = `Server error (${response.status})`;
        
      } catch (fetchError: any) {
        console.log(`[validate-url] Error testing ${testUrl}:`, fetchError.message);
        
        if (fetchError.name === 'AbortError') {
          lastError = 'Request timeout';
        } else if (fetchError.message.includes('ENOTFOUND')) {
          lastError = 'Domain not found';
        } else if (fetchError.message.includes('ECONNREFUSED')) {
          lastError = 'Connection refused';
        } else if (fetchError.message.includes('certificate') || fetchError.message.includes('SSL')) {
          lastError = 'SSL certificate error';
        } else {
          lastError = 'Connection failed';
        }
        
        continue; // Try next URL variant
      }
    }
    
    return NextResponse.json({
      isValid: false,
      error: `Unable to reach website: ${lastError}. Please check the URL and try again.`
    });
    
  } catch (error: any) {
    console.error('[validate-url] Unexpected error:', error);
    return NextResponse.json({
      isValid: false,
      error: 'Failed to validate URL. Please check your internet connection and try again.'
    }, { status: 500 });
  }
}
