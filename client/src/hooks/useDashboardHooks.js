import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminDashboard, getMechanics, updateMechanicStatus } from '../api/dashboard.api'

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboard,
  })
}

export const useAdminMechanics = (type) => {
  return useQuery({
    queryKey: ['adminMechanics', type],
    queryFn: () => getMechanics(type),
  })
}

export const useUpdateMechanicStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mechanicId, status }) => updateMechanicStatus(mechanicId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMechanics'] })
    },
  })
}
