import axios from '../lib/axios';

export const getAdminDashboard = async () => {
  const response = await axios.get('/admin/dashboard');
  return response.data;
};

export const getMechanics = async (type = 'all') => {
  // type can be 'all' or 'pending'
  const endpoint = type === 'pending' ? '/admin/dashboard/mechanics/pending' : '/admin/dashboard/mechanics';
  const response = await axios.get(endpoint);
  return response.data;
};

export const updateMechanicStatus = async (mechanicId, status) => {
  // status: 'approved' or 'rejected'
  const response = await axios.patch(`/admin/mechanics/${mechanicId}/status`, { status });
  return response.data;
};
