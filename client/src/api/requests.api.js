import api from '../lib/axios';

export const getMyRequests = async () => {
  const response = await api.get('/requests/my');
  return response.data;
};

export const createRequest = async (requestData) => {
  const response = await api.post('/requests', requestData);
  return response.data;
};

export const getAvailableRequests = async () => {
  const response = await api.get('/requests/available');
  return response.data;
};

export const getRequestDetails = async (id) => {
  const response = await api.get(`/requests/${id}`);
  return response.data;
};
