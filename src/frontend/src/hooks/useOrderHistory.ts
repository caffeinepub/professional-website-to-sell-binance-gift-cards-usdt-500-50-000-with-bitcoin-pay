import { useState, useEffect } from 'react';
import { loadOrderHistory, type OrderHistoryEntry } from '@/state/orderHistory';

// React hook to read persisted order history and keep it in sync
// Never throws - returns safe defaults on any error
export function useOrderHistory() {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Initial load with full error recovery
    const loadHistory = () => {
      try {
        const history = loadOrderHistory();
        setOrders(history);
        setHasError(false);
      } catch (error) {
        console.error('[useOrderHistory] Failed to load order history, returning empty list:', error);
        setOrders([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    // Listen for storage changes (cross-tab sync and local updates)
    const handleStorageChange = () => {
      try {
        loadHistory();
      } catch (error) {
        console.error('[useOrderHistory] Failed to handle storage change:', error);
      }
    };

    try {
      window.addEventListener('storage', handleStorageChange);
    } catch (error) {
      console.error('[useOrderHistory] Failed to add storage event listener:', error);
    }

    return () => {
      try {
        window.removeEventListener('storage', handleStorageChange);
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, []);

  return {
    orders,
    isLoading,
    hasOrders: orders.length > 0,
    hasError,
  };
}
