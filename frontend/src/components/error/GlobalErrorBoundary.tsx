import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: (error: Error | unknown, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | unknown | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown): State {
    // Handle any thrown value, not just Error instances
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    // Safely log error details to console for debugging
    // Extract message and stack without assuming error is an Error instance
    try {
      const errorMessage = this.getErrorMessage(error);
      const errorStack = this.getErrorStack(error);
      
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('[GlobalErrorBoundary] Caught error:');
      console.error('Message:', errorMessage);
      if (errorStack) {
        console.error('Stack:', errorStack);
      }
      console.error('Component stack:', errorInfo.componentStack);
      console.error('Original error:', error);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (logError) {
      // If logging fails, try minimal logging
      try {
        console.error('[GlobalErrorBoundary] Error occurred but logging failed:', error);
      } catch {
        // Complete silence if even minimal logging fails
      }
    }
  }

  private getErrorMessage(error: unknown): string {
    try {
      if (error === null || error === undefined) {
        return 'null/undefined error';
      }
      if (error instanceof Error) {
        return error.message;
      }
      if (typeof error === 'string') {
        return error;
      }
      if (typeof error === 'object' && 'message' in error) {
        const msg = (error as { message: unknown }).message;
        if (typeof msg === 'string') {
          return msg;
        }
      }
      return String(error);
    } catch {
      return 'Unable to extract error message';
    }
  }

  private getErrorStack(error: unknown): string | null {
    try {
      if (error instanceof Error && error.stack) {
        return error.stack;
      }
      if (typeof error === 'object' && error !== null && 'stack' in error) {
        const stack = (error as { stack: unknown }).stack;
        if (typeof stack === 'string') {
          return stack;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.state.error, this.reset);
    }

    return this.props.children;
  }
}
