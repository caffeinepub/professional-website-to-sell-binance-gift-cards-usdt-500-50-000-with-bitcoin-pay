import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, ExternalLink } from 'lucide-react';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { useOrderHistoryDetails } from '@/hooks/useOrderHistoryDetails';
import { getSimplifiedOrderStatus, getStatusBadgeVariant } from '@/utils/orderStatus';
import { OrderStatus } from '@/backend';
import { useActor } from '@/hooks/useActor';

export function RecentOrdersMenu() {
  const { orders: historyEntries, isLoading: historyLoading, hasOrders } = useOrderHistory();
  const { actor, isFetching } = useActor();
  
  // Get details for the first 5 recent orders
  const recentOrderIds = historyEntries.slice(0, 5).map((e) => e.orderId);
  const { orders: orderDetails, isLoading: detailsLoading } = useOrderHistoryDetails(recentOrderIds);

  // Create a map for quick lookup
  const orderDetailsMap = new Map(orderDetails.map((o) => [o.id, o]));

  // If actor is not ready, show a disabled state
  const isActorReady = !!actor && !isFetching;
  if (!isActorReady) {
    return (
      <Button variant="outline" className="gap-2" disabled>
        <ShoppingCart className="h-4 w-4" />
        <span className="hidden sm:inline">Orders</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Orders</span>
          {hasOrders && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1">
              {historyEntries.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Recent Orders
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {historyLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading order history...
          </div>
        ) : !hasOrders ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No recent orders yet.
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              {recentOrderIds.map((orderId) => {
                const entry = historyEntries.find((e) => e.orderId === orderId);
                const orderDetail = orderDetailsMap.get(orderId);
                const status = orderDetail?.status || entry?.lastKnownStatus;
                
                // Use simplified status labels
                const { label: statusLabel } = status 
                  ? getSimplifiedOrderStatus(status as OrderStatus)
                  : { label: 'Unknown' };
                const badgeVariant = status 
                  ? getStatusBadgeVariant(status as OrderStatus)
                  : 'outline';

                return (
                  <DropdownMenuItem key={orderId} asChild>
                    <Link
                      to="/order/$orderId"
                      params={{ orderId }}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {orderId}
                        </span>
                        {status && (
                          <Badge variant={badgeVariant} className="w-fit text-xs">
                            {statusLabel}
                          </Badge>
                        )}
                        {!orderDetail && detailsLoading && (
                          <span className="text-xs text-muted-foreground">Loading...</span>
                        )}
                        {!orderDetail && !detailsLoading && (
                          <span className="text-xs text-muted-foreground">Unable to load</span>
                        )}
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/orders"
                className="flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                View All Orders
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
