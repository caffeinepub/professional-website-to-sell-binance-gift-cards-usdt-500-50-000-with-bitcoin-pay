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

interface OrderSnapshot {
  orderId: string;
  btcAddress: string;
  btcAmount: string;
  usdtAmount: number;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartSession = getCartSession();
  const createOrderMutation = useCreateOrder();

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerNote, setBuyerNote] = useState('');
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Clear error when user edits form
  const handleInputChange = (setter: (value: string) => void) => (value: string) => {
    setSubmissionError(null);
    setter(value);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    
    if (!buyerName || !buyerEmail) {
      setSubmissionError('Please fill in all required fields.');
      return;
    }

    if (!cartSession) {
      setSubmissionError('Your cart session has expired. Please return to the catalog.');
      return;
    }

    const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const buyerContact = `${buyerName} <${buyerEmail}>${buyerNote ? ` | Note: ${buyerNote}` : ''}`;
    
    // Apply 50% discount to the total
    const discountedTotal = cartSession.total * 0.5;
    
    // For demo purposes, using a fixed BTC address and amount
    // In production, this would be calculated based on current BTC/USDT rate
    const btcAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const btcAmount = (discountedTotal / 45000).toFixed(8); // Rough estimate with discounted amount
    const usdtAmount = discountedTotal;

    try {
      await createOrderMutation.mutateAsync({
        id: newOrderId,
        buyerContact,
        btcPaymentAddress: btcAddress,
        amountInBitcoin: btcAmount,
      });
      
      // Capture stable snapshot BEFORE clearing cart
      setOrderSnapshot({
        orderId: newOrderId,
        btcAddress,
        btcAmount,
        usdtAmount,
      });
      
      // Now safe to clear cart
      clearCartSession();
    } catch (error) {
      console.error('Order creation failed:', error);
      
      // Map error to user-friendly message
      let errorMessage = 'Failed to create order. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('Actor not initialized')) {
          errorMessage = 'Connection to the backend is not ready. Please wait a moment and try again.';
        } else if (error.message.includes('already exists')) {
          errorMessage = 'This order already exists. Please refresh the page and try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      setSubmissionError(errorMessage);
    }
  };

  // Prioritize success view over "no cart" check
  if (orderSnapshot) {
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
              orderId={orderSnapshot.orderId}
              btcAddress={orderSnapshot.btcAddress}
              btcAmount={orderSnapshot.btcAmount}
              usdtAmount={orderSnapshot.usdtAmount}
            />
            
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate({ to: `/order/${orderSnapshot.orderId}` })}
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

  // Now check for cart session
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
                    onChange={(e) => handleInputChange(setBuyerName)(e.target.value)}
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
                    onChange={(e) => handleInputChange(setBuyerEmail)(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerNote">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="buyerNote"
                    placeholder="Any special instructions or notes..."
                    value={buyerNote}
                    onChange={(e) => handleInputChange(setBuyerNote)(e.target.value)}
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

                {submissionError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {submissionError}
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
