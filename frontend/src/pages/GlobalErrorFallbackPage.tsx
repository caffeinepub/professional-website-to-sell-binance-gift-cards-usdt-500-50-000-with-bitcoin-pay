import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface GlobalErrorFallbackPageProps {
  error?: Error | unknown;
  reset?: () => void;
}

// Use Vite's import.meta.env instead of process.env (production-safe)
const isDevelopment = import.meta.env.DEV;

// Safely extract error message and stack from any thrown value
function getErrorDetails(error: unknown): { message: string | null; stack: string | null } {
  try {
    if (!error) {
      return { message: null, stack: null };
    }
    
    let message: string | null = null;
    let stack: string | null = null;
    
    // Extract message
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack || null;
    } else if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object' && 'message' in error) {
      const msg = (error as { message: unknown }).message;
      if (typeof msg === 'string') {
        message = msg;
      }
      // Try to extract stack
      if ('stack' in error) {
        const stk = (error as { stack: unknown }).stack;
        if (typeof stk === 'string') {
          stack = stk;
        }
      }
    }
    
    return { message, stack };
  } catch {
    return { message: 'Unable to extract error details', stack: null };
  }
}

export function GlobalErrorFallbackPage({ error, reset }: GlobalErrorFallbackPageProps) {
  const navigate = useNavigate();

  const handleReload = () => {
    try {
      if (reset) {
        reset();
      }
    } catch {
      // Ignore reset errors
    }
    window.location.reload();
  };

  const handleGoHome = () => {
    try {
      if (reset) {
        reset();
      }
      navigate({ to: '/' }).catch(() => {
        // If navigation fails, just reload
        window.location.href = '/';
      });
    } catch {
      // If everything fails, force reload
      window.location.href = '/';
    }
  };

  const { message: errorMessage, stack: errorStack } = getErrorDetails(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            We encountered an unexpected error. Please try reloading the page or returning to the home page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              If this problem persists, please contact support or try again later.
            </AlertDescription>
          </Alert>
          {isDevelopment && errorMessage && (
            <div className="rounded-md bg-muted p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Error Details (dev only):</p>
              <p className="text-sm font-mono text-muted-foreground break-all">
                {errorMessage}
              </p>
              {errorStack && (
                <details className="mt-2">
                  <summary className="text-sm font-semibold text-foreground cursor-pointer">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                    {errorStack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleReload} className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload page
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="flex-1 gap-2">
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
