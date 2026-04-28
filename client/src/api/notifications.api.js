import axios from '../lib/axios';

export const getMyNotifications = async () => {
  const response = await axios.get('/notifications/my');
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const response = await axios.patch(`/notifications/${notificationId}`);
  return response.data;
};
