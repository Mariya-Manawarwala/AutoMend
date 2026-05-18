import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyVehicles, addVehicle, deleteVehicle, updateVehicle } from '../api/vehicles.api';

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: getMyVehicles,
  });
};

export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
