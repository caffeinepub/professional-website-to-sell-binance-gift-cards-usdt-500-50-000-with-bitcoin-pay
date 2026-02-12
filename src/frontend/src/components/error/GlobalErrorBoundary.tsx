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
    try {
      console.error('Global error boundary caught an error:', error);
      console.error('Error info:', errorInfo);
    } catch (logError) {
      // If logging fails, fail silently to prevent cascading errors
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
