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
  const recentOrderIds = (historyEntries || []).slice(0, 5).map((e) => e.orderId);
  const { orders: orderDetails, isLoading: detailsLoading } = useOrderHistoryDetails(recentOrderIds);

  // Create a map for quick lookup with safe fallback
  const orderDetailsMap = new Map(
    (orderDetails || []).filter(o => o && o.id).map((o) => [o.id, o])
  );

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
        <DropdownMenuLabel>Recent Orders</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {historyLoading || detailsLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading orders...
          </div>
        ) : !hasOrders ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No orders yet
          </div>
        ) : (
          <>
            {(historyEntries || []).slice(0, 5).map((entry) => {
              if (!entry || !entry.orderId) return null;
              
              const details = orderDetailsMap.get(entry.orderId);
              const status = details?.status;
              const simplifiedStatus = status ? getSimplifiedOrderStatus(status).label : 'Unknown';
              const badgeVariant = status ? getStatusBadgeVariant(status) : 'secondary';

              return (
                <DropdownMenuItem key={entry.orderId} asChild>
                  <Link
                    to="/order/$orderId"
                    params={{ orderId: entry.orderId }}
                    className="flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Package className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          Order {entry.orderId.slice(0, 8)}...
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.lastSeen).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={badgeVariant} className="text-xs">
                        {simplifiedStatus}
                      </Badge>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/orders"
                className="flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                View All Orders
                <ExternalLink className="h-4 w-4" />
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
