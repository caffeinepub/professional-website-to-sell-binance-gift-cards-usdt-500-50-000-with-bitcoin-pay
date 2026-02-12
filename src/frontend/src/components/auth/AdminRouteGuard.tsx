import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert, LogIn } from 'lucide-react';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show loading state while checking authentication or admin status
  if (isLoggingIn || (isAuthenticated && (isCheckingAdmin || !isFetched))) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <LogIn className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Login Required</CardTitle>
            </div>
            <CardDescription>
              You need to log in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Only the site owner can access the admin panel. Please log in using Internet Identity with the owner account.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button 
                onClick={login}
                disabled={isLoggingIn}
                className="flex-1"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login with Internet Identity
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate({ to: '/' })}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but not admin - show access denied
  if (isAuthenticated && isFetched && !isAdmin) {
    return (
      <div className="container py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="h-8 w-8 text-destructive" />
              <CardTitle className="text-2xl">Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Only the site owner can access the admin panel. Your account does not have the required permissions.
              </AlertDescription>
            </Alert>
            <Button 
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated and admin - render children
  return <>{children}</>;
}
