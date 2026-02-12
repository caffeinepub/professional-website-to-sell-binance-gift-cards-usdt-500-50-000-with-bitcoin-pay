import React, { ReactNode } from 'react';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';

interface SafeSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps non-critical UI sections with an error boundary
 * Prevents crashes in one section from taking down the entire app
 */
export function SafeSection({ children, fallback }: SafeSectionProps) {
  const defaultFallback = (error: unknown) => {
    // Log error but render nothing (graceful degradation)
    try {
      console.warn('[SafeSection] Section failed to render, hiding gracefully:', error);
    } catch {
      // Ignore logging errors
    }
    return null;
  };

  return (
    <GlobalErrorBoundary fallback={fallback ? () => fallback : defaultFallback}>
      {children}
    </GlobalErrorBoundary>
  );
}
