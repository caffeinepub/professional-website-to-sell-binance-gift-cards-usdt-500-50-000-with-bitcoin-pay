import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Order, ContactMessage, OrderStatus } from '@/backend';
import { Badge } from '@/components/ui/badge';
import { Package, MessageSquare, Clock } from 'lucide-react';
import { formatTimeElapsed } from '@/utils/timeElapsed';

interface RecentActivityFeedProps {
  orders: Order[];
  messages: ContactMessage[];
}

type ActivityItem =
  | { type: 'order'; order: Order; sortKey: number }
  | { type: 'message'; message: ContactMessage; sortKey: number };

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case OrderStatus.pendingPayment:
      return <Badge variant="secondary" className="text-xs">Pending</Badge>;
    case OrderStatus.paid:
      return <Badge className="bg-blue-500 text-xs">Paid</Badge>;
    case OrderStatus.delivered:
      return <Badge className="bg-green-500 text-xs">Delivered</Badge>;
    case OrderStatus.cancelled:
      return <Badge variant="destructive" className="text-xs">Cancelled</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
}

export function RecentActivityFeed({ orders, messages }: RecentActivityFeedProps) {
  const navigate = useNavigate();

  const activityItems = useMemo<ActivityItem[]>(() => {
    const now = Date.now();

    // Take last 10 orders (by array position, newest last)
    const recentOrders: ActivityItem[] = [...orders]
      .slice(-10)
      .reverse()
      .map((order, idx) => ({
        type: 'order' as const,
        order,
        sortKey: now - idx * 60000, // Approximate spacing
      }));

    // Take last 5 messages
    const recentMessages: ActivityItem[] = [...messages]
      .slice(-5)
      .reverse()
      .map((message, idx) => ({
        type: 'message' as const,
        message,
        sortKey: now - idx * 90000,
      }));

    return [...recentOrders, ...recentMessages]
      .sort((a, b) => b.sortKey - a.sortKey)
      .slice(0, 15);
  }, [orders, messages]);

  if (activityItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activityItems.map((item, idx) => {
        if (item.type === 'order') {
          const { order, sortKey } = item;
          return (
            <button
              key={`order-${order.id}-${idx}`}
              onClick={() => navigate({ to: `/admin/orders/${order.id}` })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors text-left group"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium truncate">
                    Order #{order.id.slice(0, 8)}...
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {order.buyerContact} · {Number(order.usdtAmount) > 0 ? `$${Number(order.usdtAmount).toLocaleString()} USDT` : order.amountInBitcoin + ' BTC'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {formatTimeElapsed(sortKey)}
              </div>
            </button>
          );
        } else {
          const { message, sortKey } = item;
          return (
            <div
              key={`msg-${message.id}-${idx}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                !message.isRead ? 'bg-blue-500/10' : 'bg-muted'
              }`}>
                <MessageSquare className={`h-4 w-4 ${!message.isRead ? 'text-blue-500' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                    {message.name}
                  </span>
                  {!message.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {message.message.slice(0, 60)}{message.message.length > 60 ? '...' : ''}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {formatTimeElapsed(sortKey)}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
