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
 * This function now calls the backend API to avoid CORS issues
 */
export async function testUrlAccessibility(url: string): Promise<UrlValidationResult> {
  try {
    const response = await fetch('/api/validate-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    
    if (response.ok && data.isValid) {
      return {
        isValid: true,
        finalUrl: data.finalUrl,
        statusCode: data.statusCode
      };
    } else {
      return {
        isValid: false,
        error: data.error || 'Failed to validate URL'
      };
    }
    
  } catch (error: any) {
    console.error('[testUrlAccessibility] Network error:', error);
    return {
      isValid: false,
      error: 'Network error while validating URL. Please check your connection.'
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
