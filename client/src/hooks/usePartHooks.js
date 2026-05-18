import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export const useParts = () => {
  return useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await api.get('/parts');
      return response.data;
    }
  });
};

export const useAddPart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/parts', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parts'] })
  });
};

export const useUpdatePart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/parts/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parts'] })
  });
};

export const useDeletePart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/parts/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parts'] })
  });
};
