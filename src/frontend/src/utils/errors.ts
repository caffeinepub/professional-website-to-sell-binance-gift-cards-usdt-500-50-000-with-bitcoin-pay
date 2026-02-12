/**
 * Safely convert unknown error values into user-friendly English messages
 */
export function formatErrorMessage(error: unknown): string {
  // Handle Error instances
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === 'string') {
      return msg;
    }
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if an error indicates the actor is not ready
 */
export function isActorNotReadyError(error: unknown): boolean {
  const message = formatErrorMessage(error).toLowerCase();
  return message.includes('actor not initialized') || 
         message.includes('actor not available') ||
         message.includes('not ready');
}

/**
 * Convert backend errors to user-friendly messages
 */
export function formatBackendError(error: unknown): string {
  const message = formatErrorMessage(error);
  
  // Map ownership-related errors
  if (message.includes('Site owner has already been claimed')) {
    return 'Admin access has already been claimed by another user. Please contact the site owner if you believe this is an error.';
  }
  
  // Map common backend errors to friendly messages
  if (message.includes('already exists')) {
    return 'This order already exists. Please refresh the page and try again.';
  }
  
  if (message.includes('does not exist')) {
    return 'The requested item was not found.';
  }
  
  if (message.includes('Access denied')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (isActorNotReadyError(error)) {
    return 'Connection to the backend is not ready. Please wait a moment and try again.';
  }
  
  // Return the original message if no mapping found
  return message;
}
