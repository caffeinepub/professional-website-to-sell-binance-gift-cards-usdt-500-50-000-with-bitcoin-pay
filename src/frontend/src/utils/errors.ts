/**
 * Safely convert unknown error values into user-friendly English messages
 */
export function formatErrorMessage(error: unknown): string {
  // Handle null/undefined
  if (error === null || error === undefined) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Handle Error instances
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle objects with message property
  if (typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === 'string') {
      return msg;
    }
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Normalize any thrown value into an Error-like object with message and stack
 * Safe to use in error boundaries and catch blocks - never throws
 */
export function normalizeError(error: unknown): { 
  message: string; 
  stack: string | null; 
  originalError: unknown 
} {
  try {
    const message = formatErrorMessage(error);
    let stack: string | null = null;
    
    // Try to extract stack trace
    if (error instanceof Error && error.stack) {
      stack = error.stack;
    } else if (typeof error === 'object' && error !== null && 'stack' in error) {
      const stk = (error as { stack: unknown }).stack;
      if (typeof stk === 'string') {
        stack = stk;
      }
    }
    
    return {
      message,
      stack,
      originalError: error,
    };
  } catch {
    // If normalization itself fails, return minimal safe object
    return {
      message: 'Unable to process error details',
      stack: null,
      originalError: error,
    };
  }
}

/**
 * Check if an error indicates the actor is not ready
 */
export function isActorNotReadyError(error: unknown): boolean {
  const message = formatErrorMessage(error).toLowerCase();
  return message.includes('actor not initialized') || 
         message.includes('actor not available') ||
         message.includes('connection not ready') ||
         message.includes('not ready');
}

/**
 * Check if an error indicates ownership is already claimed
 */
export function isOwnershipAlreadyClaimedError(error: unknown): boolean {
  const message = formatErrorMessage(error).toLowerCase();
  return message.includes('already been claimed') || 
         message.includes('owner has already been claimed') ||
         message.includes('site owner has already been claimed');
}

/**
 * Check if an error is an authorization/permission error from the backend
 */
export function isAuthorizationError(error: unknown): boolean {
  const message = formatErrorMessage(error).toLowerCase();
  return message.includes('unauthorised') || 
         message.includes('unauthorized') ||
         message.includes('only admin') ||
         message.includes('assign user roles') ||
         message.includes('access denied') ||
         message.includes('permission');
}

/**
 * Check if an error is a network/connectivity error
 */
export function isConnectivityError(error: unknown): boolean {
  const message = formatErrorMessage(error).toLowerCase();
  return message.includes('network') ||
         message.includes('fetch') ||
         message.includes('connection') ||
         message.includes('timeout') ||
         isActorNotReadyError(error);
}

/**
 * Convert backend errors to user-friendly messages
 */
export function formatBackendError(error: unknown): string {
  const message = formatErrorMessage(error);
  
  // Map connectivity errors first
  if (isConnectivityError(error)) {
    return 'Connection not ready. Please wait a moment and try again.';
  }
  
  // Map ownership-related errors
  if (isOwnershipAlreadyClaimedError(error)) {
    return 'Admin access has already been claimed by another user. Please contact the site owner if you believe this is an error.';
  }
  
  // Map authorization errors (including British spelling variants)
  if (isAuthorizationError(error)) {
    // Special case for ownership claim authorization errors
    if (message.toLowerCase().includes('assign user roles') || 
        message.toLowerCase().includes('only admin')) {
      return 'There was an authorization issue while claiming ownership. This may be a temporary backend configuration issue. Please try again in a moment, or contact support if the problem persists.';
    }
    return 'You do not have permission to perform this action.';
  }
  
  // Map common backend errors to friendly messages
  if (message.includes('already exists')) {
    return 'This order already exists. Please refresh the page and try again.';
  }
  
  if (message.includes('does not exist')) {
    return 'The requested item was not found.';
  }
  
  // Return the original message if no mapping found
  return message;
}
