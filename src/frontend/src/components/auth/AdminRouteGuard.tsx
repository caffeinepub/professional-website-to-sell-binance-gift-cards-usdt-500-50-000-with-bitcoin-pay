import { ReactNode, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetSiteOwner, useClaimSiteOwner } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, LogIn, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched: isAdminFetched } = useIsCallerAdmin();
  const { data: siteOwner, isLoading: isCheckingOwner, isFetched: isOwnerFetched } = useGetSiteOwner();
  const claimOwnerMutation = useClaimSiteOwner();
  const [claimSuccess, setClaimSuccess] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show loading state while checking authentication or admin status
  if (isLoggingIn || (isAuthenticated && (isCheckingAdmin || !isAdminFetched))) {
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

  // Authenticated but not admin - check if owner is unclaimed
  if (isAuthenticated && isAdminFetched && !isAdmin) {
    // Still loading owner info
    if (isCheckingOwner || !isOwnerFetched) {
      return (
        <div className="container py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    // No owner configured - offer to claim ownership
    if (siteOwner === null) {
      const handleClaimOwnership = async () => {
        try {
          await claimOwnerMutation.mutateAsync();
          setClaimSuccess(true);
        } catch (error) {
          // Error is already formatted by the mutation
          console.error('Failed to claim ownership:', error);
        }
      };

      // Show success state after claiming
      if (claimSuccess && isAdmin) {
        return (
          <div className="container py-12 max-w-2xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-2xl">Admin Access Granted</CardTitle>
                </div>
                <CardDescription>
                  You have successfully claimed ownership of this site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    You now have full admin access to manage orders and site settings.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Continue to Admin Panel
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }

      return (
        <div className="container py-12 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Claim Admin Access</CardTitle>
              </div>
              <CardDescription>
                This site does not have an owner yet. You can claim ownership now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>First-time Setup</AlertTitle>
                <AlertDescription>
                  As the first person to access the admin panel, you can claim ownership of this site. 
                  This action can only be done once and will grant you full admin access.
                </AlertDescription>
              </Alert>

              {claimOwnerMutation.isError && (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertDescription>
                    {claimOwnerMutation.error?.message || 'Failed to claim ownership. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={handleClaimOwnership}
                  disabled={claimOwnerMutation.isPending}
                  className="flex-1"
                >
                  {claimOwnerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Claiming Ownership...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Claim Admin Access
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  disabled={claimOwnerMutation.isPending}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Owner is configured but caller is not the owner - show access denied
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
