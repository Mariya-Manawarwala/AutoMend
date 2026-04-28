import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyVehicles, addVehicle } from '../api/vehicles.api'

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: getMyVehicles,
  })
}

export const useAddVehicle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
