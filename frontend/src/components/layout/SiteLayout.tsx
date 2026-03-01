import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Package, Shield, Search } from 'lucide-react';
import { SiBitcoin } from 'react-icons/si';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsOwner } from '@/hooks/useQueries';
import { useActor } from '@/hooks/useActor';
import { RecentOrdersMenu } from '@/components/orders/RecentOrdersMenu';
import { SafeSection } from '@/components/error/SafeSection';
import { PromoTicker } from '@/components/layout/PromoTicker';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { data: isOwner, isError: isOwnerError } = useIsOwner();
  const currentYear = new Date().getFullYear();

  const isActorReady = !!actor && !isFetching;
  const showAdminLink = !!identity && isActorReady && !isOwnerError && isOwner === true;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Promo Ticker at the very top */}
      <PromoTicker />
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/assets/generated/logo-giftcards.dim_512x512.png" 
              alt="Binance Gift Cards" 
              className="h-10 w-10 rounded-lg"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">Binance Gift Cards</span>
              <span className="text-xs text-muted-foreground">Premium USDT Cards</span>
            </div>
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <Link 
              to="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Catalog
            </Link>
            <Link 
              to="/track" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Track Order
            </Link>
            <Link 
              to="/faq" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              FAQ
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            {showAdminLink && (
              <Link 
                to="/admin" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <SafeSection>
              <RecentOrdersMenu />
            </SafeSection>
            <Button 
              onClick={() => navigate({ to: '/catalog' })}
              className="gap-2"
            >
              <span className="hidden sm:inline">Browse Cards</span>
              <span className="sm:hidden">Catalog</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/assets/generated/logo-giftcards.dim_512x512.png" 
                  alt="Logo" 
                  className="h-8 w-8 rounded"
                />
                <span className="font-bold">Binance Gift Cards</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional marketplace for Binance Gift Cards with secure Bitcoin payments.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  $500 - $50,000 USDT
                </li>
                <li className="flex items-center gap-2">
                  <SiBitcoin className="h-4 w-4" />
                  Bitcoin Payments
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Secure Transactions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                    Browse Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Search className="h-4 w-4" />
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <img 
                      src="/assets/generated/message-us-icon.dim_64x64.png" 
                      alt="Message" 
                      className="h-4 w-4"
                    />
                    Message Us
                  </Link>
                </li>
                {showAdminLink && (
                  <li>
                    <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>© {currentYear} Binance Gift Cards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
