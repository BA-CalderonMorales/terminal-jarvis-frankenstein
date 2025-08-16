'use client';

import { useEffect } from 'react';

export default function HydrationErrorHandler() {
  useEffect(() => {
    // Store the original console methods
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Override console.error to filter out hydration warnings caused by browser extensions
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Check if this is a hydration mismatch error caused by browser extensions
      if (
        message.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match') ||
        message.includes('fdprocessedid') ||
        message.includes('Extra attributes from the server') ||
        message.includes('browser extension') ||
        message.includes('messes with the HTML before React loaded') ||
        (message.includes('hydration') && message.includes('mismatch'))
      ) {
        // Suppress the error - it's caused by browser extensions and doesn't affect functionality
        return;
      }
      
      // For all other errors, use the original console.error
      originalConsoleError.apply(console, args);
    };
    
    // Also handle React's development warnings
    console.warn = (...args) => {
      const message = args.join(' ');
      
      if (
        message.includes('Extra attributes from the server') ||
        message.includes('fdprocessedid') ||
        message.includes('browser extension') ||
        message.includes('hydration') ||
        message.includes('mismatch')
      ) {
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };
    
    // Handle React's error logging (including hydration errors)
    const originalReactError = window.console.error;
    
    // Cleanup function to restore original console methods
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // This component doesn't render anything
  return null;
}
