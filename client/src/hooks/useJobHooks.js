import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobByRequestId, updateJob, submitBill, applyCoupon } from '../api/jobs.api'

export const useJob = (requestId) => {
  return useQuery({
    queryKey: ['job', requestId],
    queryFn: () => getJobByRequestId(requestId),
    enabled: !!requestId,
  })
}

export const useUpdateJob = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, data }) => updateJob(jobId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['job'] })
    },
  })
}

export const useSubmitBill = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job'] })
    },
  })
}

export const useApplyCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, couponCode }) => applyCoupon(jobId, couponCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job'] })
    },
  })
}
