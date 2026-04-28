import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createRequest, getRequests, acceptRequest } from '../api/requests.api'

export const useRequests = (role) => {
  return useQuery({
    queryKey: ['requests', role],
    queryFn: () => getRequests(role),
  })
}

export const useCreateRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}

export const useAcceptRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}
