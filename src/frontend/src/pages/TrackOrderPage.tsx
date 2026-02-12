import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Search, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedOrderId = orderId.trim();
    
    if (!trimmedOrderId) {
      setError('Please enter an Order ID');
      return;
    }

    // Navigate to order status page
    navigate({ to: '/order/$orderId', params: { orderId: trimmedOrderId } });
  };

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Package className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Track Your Order</h1>
        <p className="text-lg text-muted-foreground">
          Enter your Order ID to check delivery status and payment state
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
          <CardDescription>
            Check if your order has been delivered and whether payment was received
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                type="text"
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setError('');
                }}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                You received this ID when you placed your order
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full gap-2">
              <Search className="h-4 w-4" />
              Track Order
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3 text-sm">What you can check:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Order status: Pending, Processing, or Delivered</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Payment received status: Yes or No</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Payment details and Bitcoin address</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
