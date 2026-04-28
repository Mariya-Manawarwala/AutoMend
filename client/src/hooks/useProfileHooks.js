import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyProfile, updateProfile, deleteAccount } from '../api/profile.api'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
