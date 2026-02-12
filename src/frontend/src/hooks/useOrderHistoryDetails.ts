import { useQueries } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Order } from '@/backend';

// Hook to fetch order details for multiple order IDs
export function useOrderHistoryDetails(orderIds: string[]) {
  const { actor, isFetching: actorFetching } = useActor();

  const queries = useQueries({
    queries: orderIds.map((orderId) => ({
      queryKey: ['order', orderId],
      queryFn: async (): Promise<Order | null> => {
        if (!actor) return null;
        try {
          return await actor.getOrder(orderId);
        } catch (error) {
          console.error(`Failed to fetch order ${orderId}:`, error);
          return null;
        }
      },
      enabled: !!actor && !actorFetching && !!orderId,
      retry: false,
      staleTime: 30000, // 30 seconds
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const orders = queries.map((q) => q.data).filter((order): order is Order => order !== null);

  return {
    orders,
    isLoading,
    queries,
  };
}
