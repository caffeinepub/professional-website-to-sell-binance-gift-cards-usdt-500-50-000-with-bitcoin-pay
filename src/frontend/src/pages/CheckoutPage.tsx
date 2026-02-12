import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BitcoinPaymentInstructions } from '@/components/checkout/BitcoinPaymentInstructions';
import { getCartSession, clearCartSession } from '@/state/cartSession';
import { useCreateOrder } from '@/hooks/useQueries';
import { Loader2, AlertCircle, ShoppingCart } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartSession = getCartSession();
  const createOrderMutation = useCreateOrder();

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerNote, setBuyerNote] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!cartSession) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No items in cart. Please select a gift card from the catalog first.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate({ to: '/catalog' })}
        >
          Go to Catalog
        </Button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName || !buyerEmail) {
      return;
    }

    const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const buyerContact = `${buyerName} <${buyerEmail}>${buyerNote ? ` | Note: ${buyerNote}` : ''}`;
    
    // For demo purposes, using a fixed BTC address and amount
    // In production, this would be calculated based on current BTC/USDT rate
    const btcAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const btcAmount = (cartSession.total / 45000).toFixed(8); // Rough estimate

    try {
      await createOrderMutation.mutateAsync({
        id: newOrderId,
        buyerContact,
        btcPaymentAddress: btcAddress,
        amountInBitcoin: btcAmount,
      });
      
      setOrderId(newOrderId);
      clearCartSession();
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  if (orderId) {
    return (
      <div className="container py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Order Created Successfully!</CardTitle>
            <CardDescription>
              Your order has been created. Please complete the Bitcoin payment to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <BitcoinPaymentInstructions 
              orderId={orderId}
              btcAddress="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              btcAmount={(cartSession.total / 45000).toFixed(8)}
              usdtAmount={cartSession.total}
            />
            
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate({ to: `/order/${orderId}` })}
                className="flex-1"
              >
                View Order Status
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate({ to: '/catalog' })}
              >
                Browse More Cards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Checkout</h1>
        <p className="text-lg text-muted-foreground">
          Complete your order and receive Bitcoin payment instructions
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                We'll use this information to deliver your gift card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="buyerName">Full Name *</Label>
                  <Input 
                    id="buyerName"
                    placeholder="John Doe"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerEmail">Email Address *</Label>
                  <Input 
                    id="buyerEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerNote">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="buyerNote"
                    placeholder="Any special instructions or notes..."
                    value={buyerNote}
                    onChange={(e) => setBuyerNote(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    'Create Order & Get Payment Instructions'
                  )}
                </Button>

                {createOrderMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to create order. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Denomination:</span>
                  <span className="font-medium">${cartSession.denomination.toLocaleString()} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{cartSession.quantity}</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${cartSession.total.toLocaleString()} USDT
                  </span>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-xs">
                  Payment will be processed in Bitcoin (BTC). Exchange rate will be provided after order creation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
