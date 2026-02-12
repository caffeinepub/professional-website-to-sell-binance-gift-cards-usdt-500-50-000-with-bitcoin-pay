import { useState, useEffect } from 'react';
import { loadOrderHistory, type OrderHistoryEntry } from '@/state/orderHistory';

// React hook to read persisted order history and keep it in sync
export function useOrderHistory() {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const loadHistory = () => {
      const history = loadOrderHistory();
      setOrders(history);
      setIsLoading(false);
    };

    loadHistory();

    // Listen for storage changes (cross-tab sync and local updates)
    const handleStorageChange = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    orders,
    isLoading,
    hasOrders: orders.length > 0,
  };
}
