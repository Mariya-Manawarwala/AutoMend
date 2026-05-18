import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminStats, getPendingMechanics, approveMechanicApi, rejectMechanicApi, getUsersApi, updateUserAccountStatusApi, getSystemSettingsApi, updateSystemSettingsApi } from '../api/dashboard.api';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
  });
};

export const useAdminMechanics = (status = 'pending') => {
  return useQuery({
    queryKey: ['admin', 'mechanics', status],
    queryFn: getPendingMechanics,
  });
};

export const useAdminUsers = (params) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getUsersApi(params),
  });
};

export const useUpdateUserAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, ...data }) => updateUserAccountStatusApi(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useUpdateMechanicStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mechanicId, status, reason }) => {
      if (status === 'approved') return approveMechanicApi(mechanicId);
      return rejectMechanicApi(mechanicId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: getSystemSettingsApi,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSystemSettingsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
};
