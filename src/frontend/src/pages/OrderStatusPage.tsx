import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { BitcoinPaymentInstructions } from '@/components/checkout/BitcoinPaymentInstructions';
import { useGetOrder } from '@/hooks/useQueries';
import { useBtcUsdtRate } from '@/hooks/useBtcUsdtRate';
import { convertBtcToUsdtWithRate } from '@/utils/pricing';
import { getSimplifiedOrderStatus, getStatusBadgeVariant } from '@/utils/orderStatus';
import { getBtcRateStatusMessage } from '@/utils/btcRate';
import { OrderStatus } from '@/backend';
import { Loader2, AlertCircle, CheckCircle2, Clock, XCircle, Package } from 'lucide-react';

export default function OrderStatusPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useGetOrder(orderId);
  const { effectiveRate, source, isLoading: rateLoading, isFetched: rateFetched } = useBtcUsdtRate();

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

  // Get simplified status and payment state
  const { label: statusLabel, paymentReceived } = getSimplifiedOrderStatus(order.status);
  const badgeVariant = getStatusBadgeVariant(order.status);

  // Calculate estimated USDT amount from BTC amount using current live rate
  const estimatedUsdtAmount = convertBtcToUsdtWithRate(order.amountInBitcoin, effectiveRate);
  
  // Get rate status message
  const rateStatusMessage = getBtcRateStatusMessage(source, rateLoading, rateFetched);

  // Get icon for status badge
  const getStatusIcon = () => {
    switch (order.status) {
      case OrderStatus.pendingPayment:
        return <Clock className="h-3 w-3" />;
      case OrderStatus.paid:
        return <CheckCircle2 className="h-3 w-3" />;
      case OrderStatus.delivered:
        return <Package className="h-3 w-3" />;
      case OrderStatus.cancelled:
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

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
              <Badge variant={badgeVariant} className="gap-1">
                {getStatusIcon()}
                {statusLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                <p className="font-medium text-lg">{statusLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Received</p>
                <p className="font-medium text-lg">
                  {paymentReceived === 'Yes' && (
                    <span className="text-green-600 dark:text-green-400">Yes</span>
                  )}
                  {paymentReceived === 'No' && (
                    <span className="text-amber-600 dark:text-amber-400">No</span>
                  )}
                  {paymentReceived === 'Cancelled' && (
                    <span className="text-destructive">Cancelled</span>
                  )}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bitcoin Amount</p>
                <p className="font-mono font-medium">{order.amountInBitcoin} BTC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated USDT Value</p>
                <p className="font-medium">
                  ≈ ${estimatedUsdtAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on current rate ({rateStatusMessage})
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Address</p>
              <p className="font-mono text-sm break-all bg-muted/50 p-3 rounded border">
                {order.btcPaymentAddress}
              </p>
            </div>

            {order.status === OrderStatus.pendingPayment && (
              <>
                <Separator />
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Your order is awaiting payment. Please complete the Bitcoin transaction to proceed.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {order.status === OrderStatus.paid && (
              <>
                <Separator />
                <Alert className="border-blue-500/20 bg-blue-500/5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <AlertDescription>
                    Payment received! Your order is being processed and will be delivered shortly.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {order.status === OrderStatus.delivered && (
              <>
                <Separator />
                <Alert className="border-green-500/20 bg-green-500/5">
                  <Package className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    Your gift card has been delivered! Check your email for details.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {order.status === OrderStatus.cancelled && (
              <>
                <Separator />
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    This order has been cancelled. If you have any questions, please contact support.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            onClick={() => navigate({ to: '/catalog' })}
            variant="outline"
            className="flex-1"
          >
            Browse More Cards
          </Button>
          <Button 
            onClick={() => navigate({ to: '/track' })}
            variant="outline"
            className="flex-1"
          >
            Track Another Order
          </Button>
        </div>
      </div>
    </div>
  );
}
