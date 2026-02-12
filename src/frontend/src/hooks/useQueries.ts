import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Order, type OrderId, type OrderStatus } from '@/backend';

export function useGetOrder(orderId: OrderId) {
  const { actor, isFetching } = useActor();

  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: OrderId;
      buyerContact: string;
      btcPaymentAddress: string;
      amountInBitcoin: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createOrder(
        params.id,
        params.buyerContact,
        params.btcPaymentAddress,
        params.amountInBitcoin
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      orderId: OrderId;
      newStatus: OrderStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateOrderStatus(params.orderId, params.newStatus);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
  });
}
