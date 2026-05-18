import api from '../lib/axios';

export const getMyNotifications = async () => {
  const response = await api.get('/notifications/my');
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};
