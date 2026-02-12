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

export function GlobalErrorFallbackPage({ error, reset }: GlobalErrorFallbackPageProps) {
  const navigate = useNavigate();

  const handleReload = () => {
    if (reset) {
      reset();
    }
    window.location.reload();
  };

  const handleGoHome = () => {
    if (reset) {
      reset();
    }
    navigate({ to: '/' }).catch(() => {
      // If navigation fails, just reload
      window.location.href = '/';
    });
  };

  // Safely extract error message
  const getErrorMessage = (): string | null => {
    if (!error) return null;
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      const msg = (error as { message: unknown }).message;
      if (typeof msg === 'string') return msg;
    }
    return null;
  };

  const errorMessage = getErrorMessage();

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
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {errorMessage}
              </p>
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
