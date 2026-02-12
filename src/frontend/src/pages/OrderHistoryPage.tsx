import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, ExternalLink, AlertCircle } from 'lucide-react';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { useOrderHistoryDetails } from '@/hooks/useOrderHistoryDetails';
import { getSimplifiedOrderStatus, getStatusBadgeVariant } from '@/utils/orderStatus';
import { OrderStatus } from '@/backend';

export default function OrderHistoryPage() {
  const { orders: historyEntries, isLoading: historyLoading, hasOrders } = useOrderHistory();
  
  // Get details for all orders in history
  const orderIds = historyEntries.map((e) => e.orderId);
  const { orders: orderDetails, isLoading: detailsLoading, queries } = useOrderHistoryDetails(orderIds);

  // Create a map for quick lookup
  const orderDetailsMap = new Map(orderDetails.map((o) => [o.id, o]));

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Order History</h1>
        <p className="text-lg text-muted-foreground">
          View all your past orders and their current status
        </p>
      </div>

      {historyLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Loading order history...</p>
          </div>
        </div>
      ) : !hasOrders ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Browse our catalog to get started!
            </p>
            <Button asChild>
              <Link to="/catalog">Browse Catalog</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {historyEntries.map((entry, index) => {
            const orderDetail = orderDetailsMap.get(entry.orderId);
            const query = queries[index];
            const hasError = query?.isError || false;
            const status = orderDetail?.status || entry.lastKnownStatus;
            
            // Use simplified status labels
            const { label: statusLabel } = status 
              ? getSimplifiedOrderStatus(status as OrderStatus)
              : { label: 'Unknown' };
            const badgeVariant = status 
              ? getStatusBadgeVariant(status as OrderStatus)
              : 'outline';

            return (
              <Card key={entry.orderId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">Order #{entry.orderId}</CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(entry.lastSeen).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                    </div>
                    {status && (
                      <Badge variant={badgeVariant}>
                        {statusLabel}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {detailsLoading && !orderDetail ? (
                    <p className="text-sm text-muted-foreground">Loading order details...</p>
                  ) : hasError ? (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Unable to load order details. The order may no longer exist.
                      </AlertDescription>
                    </Alert>
                  ) : orderDetail ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Bitcoin Amount</p>
                          <p className="font-mono font-medium">{orderDetail.amountInBitcoin} BTC</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contact</p>
                          <p className="font-medium">{orderDetail.buyerContact}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Payment Address</p>
                        <p className="font-mono text-xs break-all bg-muted/50 p-2 rounded">
                          {orderDetail.btcPaymentAddress}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  
                  <Button asChild variant="outline" className="w-full mt-4 gap-2">
                    <Link to="/order/$orderId" params={{ orderId: entry.orderId }}>
                      View Details
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
