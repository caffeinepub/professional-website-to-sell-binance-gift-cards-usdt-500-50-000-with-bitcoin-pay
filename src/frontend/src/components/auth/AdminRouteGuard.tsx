import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsOwner, useGetSiteOwner, useClaimSiteOwner } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, LogIn, ShieldCheck, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { isAuthorizationError } from '@/utils/errors';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, login, loginStatus, clear } = useInternetIdentity();
  const { data: isOwner, isLoading: isCheckingOwner, isFetched: isOwnerFetched, refetch: refetchIsOwner } = useIsOwner();
  const { data: siteOwner, isLoading: isCheckingSiteOwner, isFetched: isSiteOwnerFetched, refetch: refetchSiteOwner } = useGetSiteOwner();
  const claimOwnerMutation = useClaimSiteOwner();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // After successful claim, navigate to admin orders
  useEffect(() => {
    if (claimOwnerMutation.isSuccess && isOwner) {
      const timer = setTimeout(() => {
        navigate({ to: '/admin/orders' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [claimOwnerMutation.isSuccess, isOwner, navigate]);

  // Show loading state while logging in or while authenticated and checking owner status
  if (isLoggingIn || (isAuthenticated && isCheckingOwner)) {
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

  // Authenticated - check owner status (only wait for isOwnerFetched, not isCheckingOwner)
  if (isAuthenticated && isOwnerFetched) {
    // User is the owner - grant access
    if (isOwner) {
      return <>{children}</>;
    }

    // Still loading site owner info
    if (isCheckingSiteOwner) {
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
          // After successful claim, refetch owner status
          await Promise.all([
            refetchSiteOwner(),
            refetchIsOwner(),
          ]);
        } catch (error) {
          // Error is already formatted by the mutation
          console.error('Failed to claim ownership:', error);
        }
      };

      const handleRetry = async () => {
        // Reset mutation state
        claimOwnerMutation.reset();
        // Refetch owner status to check current state
        await Promise.all([
          refetchSiteOwner(),
          refetchIsOwner(),
        ]);
      };

      // Check error type
      const errorMessage = claimOwnerMutation.error?.message || '';
      const isAlreadyClaimed = errorMessage.toLowerCase().includes('already been claimed') || 
                               errorMessage.toLowerCase().includes('already claimed');
      const isAuthError = isAuthorizationError(claimOwnerMutation.error);

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
              {!isAlreadyClaimed && !isAuthError && (
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>First-time Setup</AlertTitle>
                  <AlertDescription>
                    As the first person to access the admin panel, you can claim ownership of this site. 
                    This action can only be done once and will grant you full admin access.
                  </AlertDescription>
                </Alert>
              )}

              {claimOwnerMutation.isError && (
                <Alert variant={isAuthError ? "default" : "destructive"}>
                  {isAuthError ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {isAuthError ? 'Authorization Issue' : 'Claim Failed'}
                  </AlertTitle>
                  <AlertDescription>
                    {isAuthError ? (
                      <>
                        There was a temporary authorization issue while claiming ownership. 
                        This can happen during initial backend setup. Please wait a moment and click Retry.
                      </>
                    ) : (
                      errorMessage
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {claimOwnerMutation.isSuccess && (
                <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    Ownership claimed successfully! Redirecting to admin panel...
                  </AlertDescription>
                </Alert>
              )}

              {isAlreadyClaimed && (
                <Alert>
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Already Claimed</AlertTitle>
                  <AlertDescription>
                    Admin access has already been claimed by another user. If you are the site owner, please log out and log in with the correct account.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                {claimOwnerMutation.isError ? (
                  <>
                    <Button 
                      onClick={handleRetry}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                    {isAlreadyClaimed && (
                      <Button 
                        onClick={async () => {
                          await clear();
                          navigate({ to: '/' });
                        }}
                        className="flex-1"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Switch Account
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => navigate({ to: '/' })}
                    >
                      Back to Home
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleClaimOwnership}
                      disabled={claimOwnerMutation.isPending || claimOwnerMutation.isSuccess || isAlreadyClaimed}
                      className="flex-1"
                    >
                      {claimOwnerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Claiming Ownership...
                        </>
                      ) : claimOwnerMutation.isSuccess ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Claimed Successfully
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Owner is configured but caller is not the owner - show access denied with details
    const currentPrincipal = identity?.getPrincipal().toString() || 'Unknown';
    const ownerPrincipal = siteOwner ? siteOwner.toString() : 'Not set';

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

            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Your Principal ID:</p>
                <p className="text-xs font-mono break-all">{currentPrincipal}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Site Owner Principal ID:</p>
                <p className="text-xs font-mono break-all">{ownerPrincipal}</p>
              </div>
            </div>

            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Need Access?</AlertTitle>
              <AlertDescription>
                If you are the site owner, please log out and log in again using Internet Identity with the owner account.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={async () => {
                  await clear();
                  queryClient.clear();
                  navigate({ to: '/' });
                }}
                className="flex-1"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Log Out & Switch Account
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

  // Fallback loading state
  return (
    <div className="container py-12 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
