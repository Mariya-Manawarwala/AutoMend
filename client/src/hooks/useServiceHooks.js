import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllServices, addService, updateService, deleteService } from '../api/services.api';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getAllServices,
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] })
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] })
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] })
  });
};
