import api from '../lib/axios';

export const getCustomerStats = async () => {
  const response = await api.get('/admin/dashboard/customer-stats');
  return response.data;
};

export const getMechanicStats = async () => {
  const response = await api.get('/admin/dashboard/mechanic-stats');
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getPendingMechanics = async () => {
  const response = await api.get('/admin/dashboard/mechanics/pending');
  return response.data;
};

export const approveMechanicApi = async (mechanicId) => {
  const response = await api.put(`/admin/dashboard/mechanics/${mechanicId}/approve`);
  return response.data;
};

export const rejectMechanicApi = async (mechanicId, reason) => {
  const response = await api.put(`/admin/dashboard/mechanics/${mechanicId}/reject`, { reason });
  return response.data;
};

export const getUsersApi = async (params) => {
  const response = await api.get('/admin/dashboard/users', { params });
  return response.data;
};

export const updateUserAccountStatusApi = async (userId, data) => {
  const response = await api.put(`/admin/dashboard/users/${userId}/account-status`, data);
  return response.data;
};

export const getSystemSettingsApi = async () => {
  const response = await api.get('/admin/dashboard/settings');
  return response.data;
};

export const updateSystemSettingsApi = async (data) => {
  const response = await api.put('/admin/dashboard/settings', data);
  return response.data;
};
