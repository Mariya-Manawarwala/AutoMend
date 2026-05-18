import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPaymentOrder, verifyPayment, getMyPayments, getPaymentBreakdown, getAllPayments } from '../api/payments.api';

export const useMyPayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: getMyPayments,
  });
};

export const usePaymentBreakdown = (id) => {
  return useQuery({
    queryKey: ['payment-breakdown', id],
    queryFn: () => getPaymentBreakdown(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createPaymentOrder,
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useAdminPayments = () => {
  return useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: getAllPayments,
  });
};
