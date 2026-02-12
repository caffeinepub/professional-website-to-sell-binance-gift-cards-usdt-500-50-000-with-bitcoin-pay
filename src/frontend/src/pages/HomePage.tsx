import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DenominationRangeCallout } from '@/components/storefront/DenominationRangeCallout';
import { ArrowRight, Shield, Zap, Lock, Globe } from 'lucide-react';
import { SiBitcoin } from 'react-icons/si';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-background" />
        <div className="container relative py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                Premium Gift Cards
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Binance Gift Cards
                <span className="block text-primary mt-2">Powered by Bitcoin</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Purchase premium Binance Gift Cards with USDT denominations from $500 to $50,000. 
                Secure, fast, and powered by Bitcoin payments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate({ to: '/catalog' })}
                  className="gap-2"
                >
                  Browse Catalog
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate({ to: '/catalog' })}
                >
                  View Pricing
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
              <img 
                src="/assets/generated/hero-giftcards.dim_1600x600.png"
                alt="Binance Gift Cards"
                className="relative rounded-2xl shadow-2xl border border-border/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Denomination Range Callout */}
      <section className="container py-12">
        <DenominationRangeCallout />
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional, secure, and reliable gift card marketplace with Bitcoin payment integration
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <SiBitcoin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Bitcoin Payments</CardTitle>
              <CardDescription>
                Secure cryptocurrency transactions with Bitcoin
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Safe</CardTitle>
              <CardDescription>
                Protected transactions with order tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Fast Delivery</CardTitle>
              <CardDescription>
                Quick processing after payment confirmation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Global Access</CardTitle>
              <CardDescription>
                Available worldwide with 24/7 support
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/40 bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple three-step process to get your Binance Gift Card
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Select Amount</h3>
              <p className="text-muted-foreground">
                Choose your desired USDT denomination from $500 to $50,000
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Pay with Bitcoin</h3>
              <p className="text-muted-foreground">
                Complete payment using Bitcoin to our secure address
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Receive Card</h3>
              <p className="text-muted-foreground">
                Get your gift card delivered after payment verification
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              onClick={() => navigate({ to: '/catalog' })}
              className="gap-2"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
