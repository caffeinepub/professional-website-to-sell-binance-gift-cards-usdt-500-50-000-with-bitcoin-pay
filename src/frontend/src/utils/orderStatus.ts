import { OrderStatus } from '@/backend';

export interface SimplifiedOrderStatus {
  label: string;
  paymentReceived: 'Yes' | 'No' | 'Cancelled';
}

/**
 * Convert backend OrderStatus to simplified buyer-facing labels
 * and derive payment received state
 */
export function getSimplifiedOrderStatus(status: OrderStatus): SimplifiedOrderStatus {
  switch (status) {
    case OrderStatus.pendingPayment:
      return {
        label: 'Pending',
        paymentReceived: 'No',
      };
    case OrderStatus.paid:
      return {
        label: 'Processing',
        paymentReceived: 'Yes',
      };
    case OrderStatus.delivered:
      return {
        label: 'Delivered',
        paymentReceived: 'Yes',
      };
    case OrderStatus.cancelled:
      return {
        label: 'Cancelled',
        paymentReceived: 'Cancelled',
      };
    default:
      return {
        label: 'Unknown',
        paymentReceived: 'No',
      };
  }
}

/**
 * Get badge variant for simplified status labels
 */
export function getStatusBadgeVariant(status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case OrderStatus.pendingPayment:
      return 'secondary';
    case OrderStatus.paid:
      return 'default';
    case OrderStatus.delivered:
      return 'outline';
    case OrderStatus.cancelled:
      return 'destructive';
    default:
      return 'outline';
  }
}
