import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Order, type OrderId, type OrderStatus, type ContactMessage } from '@/backend';
import { type Principal } from '@dfinity/principal';
import { formatBackendError } from '@/utils/errors';

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
    }) => {
      if (!actor) {
        throw new Error('Actor not initialized. Please wait a moment and try again.');
      }
      
      try {
        await actor.createOrder(
          params.id,
          params.buyerContact,
          params.btcPaymentAddress,
          params.amountInBitcoin
        );
      } catch (error) {
        // Convert backend errors to user-friendly messages
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      // Log for debugging but don't expose raw errors to UI
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
  const { actor, isFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactMessages();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useIsOwner() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isOwner'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isOwner();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetSiteOwner() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal | null>({
    queryKey: ['siteOwner'],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getSiteOwner();
      // Normalize the optional result - handle both null and empty array cases
      if (result === null || result === undefined) {
        return null;
      }
      // If it's an array-like structure (from Candid optional encoding)
      if (Array.isArray(result)) {
        return result.length > 0 ? result[0] : null;
      }
      // Otherwise return as-is (should be a Principal)
      return result;
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useClaimSiteOwner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Actor not initialized. Please wait a moment and try again.');
      }
      
      try {
        await actor.claimSiteOwner();
      } catch (error) {
        throw new Error(formatBackendError(error));
      }
    },
    onSuccess: async () => {
      // Invalidate and refetch all admin-related queries to refresh UI immediately
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['siteOwner'] }),
        queryClient.invalidateQueries({ queryKey: ['isOwner'] }),
        queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] }),
      ]);
      
      // Force refetch to ensure fresh data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['siteOwner'] }),
        queryClient.refetchQueries({ queryKey: ['isOwner'] }),
      ]);
    },
  });
}
