import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { BitcoinPaymentInstructions } from '@/components/checkout/BitcoinPaymentInstructions';
import { useGetOrder } from '@/hooks/useQueries';
import { OrderStatus } from '@/backend';
import { Loader2, AlertCircle, CheckCircle2, Clock, XCircle, Package } from 'lucide-react';

export default function OrderStatusPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useGetOrder(orderId);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pendingPayment:
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending Payment</Badge>;
      case OrderStatus.paid:
        return <Badge className="gap-1 bg-blue-500"><CheckCircle2 className="h-3 w-3" /> Paid</Badge>;
      case OrderStatus.delivered:
        return <Badge className="gap-1 bg-green-500"><Package className="h-3 w-3" /> Delivered</Badge>;
      case OrderStatus.cancelled:
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container py-12 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Order not found. Please check your order ID and try again.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate({ to: '/catalog' })}
        >
          Back to Catalog
        </Button>
      </div>
    );
  }

  // Calculate USDT amount from BTC amount (reverse of checkout calculation)
  // Using the same conversion rate: btcAmount = usdtAmount / 45000
  // Therefore: usdtAmount = btcAmount * 45000
  const estimatedUsdtAmount = parseFloat(order.amountInBitcoin) * 45000;

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Order Status</h1>
        <p className="text-lg text-muted-foreground">
          Track your order and view payment details
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription className="mt-2">
                  {order.buyerContact}
                </CardDescription>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bitcoin Amount</p>
                <p className="font-mono font-medium">{order.amountInBitcoin} BTC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Address</p>
                <p className="font-mono text-sm break-all">{order.btcPaymentAddress}</p>
              </div>
            </div>

            <Separator />

            {order.status === OrderStatus.pendingPayment && (
              <>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Your order is awaiting payment. Please complete the Bitcoin transaction to proceed.
                  </AlertDescription>
                </Alert>
                <BitcoinPaymentInstructions 
                  orderId={order.id}
                  btcAddress={order.btcPaymentAddress}
                  btcAmount={order.amountInBitcoin}
                  usdtAmount={estimatedUsdtAmount}
                />
              </>
            )}

            {order.status === OrderStatus.paid && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Payment received! Your order is being processed and will be delivered soon.
                </AlertDescription>
              </Alert>
            )}

            {order.status === OrderStatus.delivered && (
              <Alert className="border-green-500 bg-green-500/10">
                <Package className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700 dark:text-green-400">
                  Your gift card has been delivered! Check your email for details.
                </AlertDescription>
              </Alert>
            )}

            {order.status === OrderStatus.cancelled && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  This order has been cancelled. Please contact support if you have questions.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={() => navigate({ to: '/catalog' })}
                className="flex-1"
              >
                Browse More Cards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
