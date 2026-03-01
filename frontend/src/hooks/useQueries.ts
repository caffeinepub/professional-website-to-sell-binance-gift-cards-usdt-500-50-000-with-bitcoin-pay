import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Order, type OrderId, type OrderStatus, type ContactMessage, type AdminStats } from '@/backend';
import { type Principal } from '@dfinity/principal';
import { formatBackendError } from '@/utils/errors';

export function useGetOrder(orderId: OrderId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !actorFetching && !!orderId,
    retry: 1,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllOrders();
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
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
      denomination: bigint;
      usdtAmount: bigint;
    }) => {
      if (!actor) {
        throw new Error('Actor not initialized. Please wait a moment and try again.');
      }
      
      try {
        await actor.createOrder(
          params.id,
          params.buyerContact,
          params.btcPaymentAddress,
          params.amountInBitcoin,
          params.denomination,
          params.usdtAmount,
        );
      } catch (error) {
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
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
      if (!actor) {
        throw new Error('Actor not initialized. Please wait a moment and try again.');
      }
      
      try {
        await actor.updateOrderStatus(params.orderId, params.newStatus);
      } catch (error) {
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useBulkUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      ids: OrderId[];
      newStatus: OrderStatus;
    }) => {
      if (!actor) {
        throw new Error('Actor not initialized. Please wait a moment and try again.');
      }
      try {
        await actor.bulkUpdateOrderStatus(params.ids, params.newStatus);
      } catch (error) {
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useCreateContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      contactDetail: string;
      message: string;
    }) => {
      if (!actor) {
        throw new Error('Connection not ready. Please wait a moment and try again.');
      }
      
      try {
        await actor.createContactMessage(
          params.name,
          params.contactDetail,
          params.message
        );
      } catch (error) {
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

export function useGetContactMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getContactMessages();
      } catch (error) {
        console.error('Failed to fetch contact messages:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useMarkContactMessageAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized.');
      try {
        await actor.markContactMessageAsRead(id);
      } catch (error) {
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadContactMessageCount'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useGetUnreadContactMessageCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['unreadContactMessageCount'],
    queryFn: async () => {
      if (!actor) return 0n;
      try {
        return await actor.getUnreadContactMessageCount();
      } catch (error) {
        return 0n;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    refetchInterval: 30000,
  });
}

export function useGetAdminStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAdminStats();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    refetchInterval: 60000,
  });
}

export function useGetOrdersByDenomination() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, bigint]>>({
    queryKey: ['ordersByDenomination'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getOrdersByDenomination();
      } catch (error) {
        console.error('Failed to fetch denomination breakdown:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isOwner'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isOwner();
      } catch (error) {
        console.error('Failed to check owner status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetSiteOwner() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal | null>({
    queryKey: ['siteOwner'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getSiteOwner();
        if (result === null || result === undefined) {
          return null;
        }
        return result as Principal;
      } catch (error) {
        console.error('Failed to fetch site owner:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useClaimSiteOwner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Connection not ready. Please wait a moment and try again.');
      }
      
      try {
        await actor.claimSiteOwner();
      } catch (error) {
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteOwner'] });
      queryClient.invalidateQueries({ queryKey: ['isOwner'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}
