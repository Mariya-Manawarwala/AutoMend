import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { createOrder, verifyPayment, getMechanicEarnings } from '../api/payments.api'

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  })
}

export const useVerifyPayment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job'] })
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}

export const useMechanicEarnings = (month, year) => {
  return useQuery({
    queryKey: ['earnings', month, year],
    queryFn: () => getMechanicEarnings(month, year),
    enabled: !!month && !!year,
  })
}
