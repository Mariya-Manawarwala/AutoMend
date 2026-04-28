import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyNotifications, markAsRead } from '../api/notifications.api'

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000, // Poll every 30s
  })
}

export const useMarkRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
