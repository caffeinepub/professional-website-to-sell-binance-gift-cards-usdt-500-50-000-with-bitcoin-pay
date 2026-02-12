import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DenominationCardGrid } from '@/components/storefront/DenominationCardGrid';
import { QuantitySelector } from '@/components/storefront/QuantitySelector';
import { DenominationRangeCallout } from '@/components/storefront/DenominationRangeCallout';
import { ArrowRight, Package } from 'lucide-react';
import { SiBinance } from 'react-icons/si';
import { saveCartSession } from '@/state/cartSession';
import { SUPPORTED_DENOMINATIONS } from '@/utils/denominations';

export default function CatalogPage() {
  const navigate = useNavigate();
  const [denomination, setDenomination] = useState<number>(SUPPORTED_DENOMINATIONS[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const total = denomination * quantity;

  const handleContinueToCheckout = () => {
    saveCartSession({
      denomination,
      quantity,
      total,
    });
    navigate({ to: '/checkout' });
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Gift Card Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Select your desired denomination and quantity
        </p>
      </div>

      <DenominationRangeCallout />

      <div className="mt-12 space-y-8">
        {/* Denomination Selection */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Choose Denomination</h2>
          <DenominationCardGrid 
            selectedDenomination={denomination}
            onSelect={setDenomination}
          />
        </div>

        {/* Quantity and Checkout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-2 border-binance-dark-border bg-binance-dark">
              <CardContent className="p-0">
                <img 
                  src="/assets/generated/product-giftcard-illustration.dim_800x800.png"
                  alt="Binance Gift Card"
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
            <Card className="border-2 border-binance-dark-border bg-binance-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Package className="h-5 w-5 text-binance-yellow" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-binance-yellow/70">Type:</span>
                  <span className="font-medium flex items-center gap-1 text-white">
                    <SiBinance className="h-4 w-4 text-binance-yellow" />
                    Binance Gift Card
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-binance-yellow/70">Currency:</span>
                  <span className="font-medium text-white">USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-binance-yellow/70">Range:</span>
                  <span className="font-medium text-white">
                    ${Math.min(...SUPPORTED_DENOMINATIONS).toLocaleString()} - ${Math.max(...SUPPORTED_DENOMINATIONS).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-binance-yellow/70">Payment:</span>
                  <span className="font-medium text-white">Bitcoin (BTC)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selection Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configure Your Order</CardTitle>
                <CardDescription>
                  Choose quantity for your selected gift card
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <QuantitySelector 
                  value={quantity}
                  onChange={setQuantity}
                />

                <div className="rounded-lg border border-border bg-muted/50 p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Denomination:</span>
                    <span className="font-medium">${denomination.toLocaleString()} USDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${total.toLocaleString()} USDT
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={handleContinueToCheckout}
                >
                  Continue to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
