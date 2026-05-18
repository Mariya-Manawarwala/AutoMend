import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, deleteAccount } from '../api/profile.api';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      const updatedUser = data.user || data;
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Update local auth state and localStorage too
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    },
  });
};

export const useDeleteAccount = () => {
  const { logout } = useAuth();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      logout();
    },
  });
};
