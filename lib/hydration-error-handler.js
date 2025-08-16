// Hydration error handler to suppress browser extension warnings
// This addresses hydration mismatches caused by browser extensions adding attributes like fdprocessedid

if (typeof window !== 'undefined') {
  // Store the original console.error
  const originalConsoleError = console.error;
  
  // Override console.error to filter out hydration warnings
  console.error = (...args) => {
    const message = args[0];
    
    // Check if this is a hydration mismatch error caused by browser extensions
    if (
      typeof message === 'string' &&
      (
        message.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match the client properties') ||
        message.includes('fdprocessedid') ||
        (message.includes('hydration') && message.includes('browser extension'))
      )
    ) {
      // Suppress the error - it's caused by browser extensions and doesn't affect functionality
      return;
    }
    
    // For all other errors, use the original console.error
    originalConsoleError.apply(console, args);
  };
  
  // Also handle React's development warnings
  if (process.env.NODE_ENV === 'development') {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      
      if (
        typeof message === 'string' &&
        (
          message.includes('Extra attributes from the server') ||
          message.includes('fdprocessedid') ||
          message.includes('browser extension')
        )
      ) {
        return;
      }
      
      originalWarn.apply(console, args);
    };
  }
}
