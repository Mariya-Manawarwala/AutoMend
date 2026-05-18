import { useQuery } from '@tanstack/react-query';
import api from '../api/axios'; // Wait, I should use api/profile.api or similar

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customer-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/customer/stats');
      return response.data;
    }
  });
};
