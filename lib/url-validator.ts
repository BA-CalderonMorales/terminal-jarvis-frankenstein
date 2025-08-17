/**
 * URL validation utilities for Terminal Jarvis Frankenstein
 * Validates and tests URL accessibility before proceeding with website cloning
 */

export interface UrlValidationResult {
  isValid: boolean;
  finalUrl?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Basic URL format validation
 */
export function isValidUrlFormat(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Check for valid domain with at least one dot (e.g., example.com)
    const hasValidDomain = urlObj.hostname.includes('.') && urlObj.hostname.length > 3;
    return hasValidDomain && (urlObj.protocol === 'http:' || urlObj.protocol === 'https:');
  } catch {
    return false;
  }
}

/**
 * Normalize URL by adding protocol if missing
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  
  // If it already has a protocol, return as is
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }
  
  // Add https:// by default
  return `https://${trimmed}`;
}

/**
 * Test if a URL is actually accessible by making a lightweight request
 */
export async function testUrlAccessibility(url: string): Promise<UrlValidationResult> {
  try {
    const normalizedUrl = normalizeUrl(url);
    
    // First check if it's a valid format
    if (!isValidUrlFormat(normalizedUrl)) {
      return {
        isValid: false,
        error: 'Invalid URL format. Please provide a valid website URL (e.g., firecrawl.dev, stripe.com, github.com)'
      };
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
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        let response;
        try {
          // Try HEAD request first (faster)
          response = await fetch(testUrl, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Terminal-Jarvis-Frankenstein/1.0 (Website-Cloning-Tool)'
            }
          });
        } catch (headError) {
          // If HEAD fails, try GET request
          response = await fetch(testUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Terminal-Jarvis-Frankenstein/1.0 (Website-Cloning-Tool)'
            }
          });
        }
        
        clearTimeout(timeoutId);
        
        // Consider 2xx, 3xx, and even some 4xx as "accessible" 
        // (site exists but might have restrictions)
        if (response.status < 500) {
          return {
            isValid: true,
            finalUrl: testUrl,
            statusCode: response.status
          };
        }
        
        lastError = `Server error (${response.status})`;
        
      } catch (fetchError: any) {
        lastError = fetchError.name === 'AbortError' ? 'Request timeout' : 'Connection failed';
        continue; // Try next URL variant
      }
    }
    
    return {
      isValid: false,
      error: `Unable to reach website: ${lastError}. Please check the URL and try again.`
    };
    
  } catch (error: any) {
    return {
      isValid: false,
      error: 'Failed to validate URL. Please check your internet connection and try again.'
    };
  }
}

/**
 * Quick validation for real-time feedback (without network requests)
 */
export function quickValidateUrl(input: string): { isValid: boolean; suggestion?: string } {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { isValid: false };
  }
  
  // Check if it looks like a domain
  const domainPattern = /^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/?.*)?$/;
  
  if (domainPattern.test(trimmed)) {
    return { isValid: true };
  }
  
  // Provide suggestions for common mistakes
  if (trimmed.includes(' ')) {
    return { 
      isValid: false, 
      suggestion: 'URLs cannot contain spaces. Try a website domain like "example.com"' 
    };
  }
  
  if (!trimmed.includes('.')) {
    return { 
      isValid: false, 
      suggestion: 'Enter a website URL like "firecrawl.dev" or "github.com"' 
    };
  }
  
  return { 
    isValid: false, 
    suggestion: 'Please enter a valid website URL (e.g., firecrawl.dev, stripe.com)' 
  };
}
