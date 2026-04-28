import axios from '../lib/axios';

export const createRequest = async (requestData) => {
  const response = await axios.post('/requests', requestData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getRequests = async (role) => {
  const response = await axios.get(`/requests?role=${role}`);
  return response.data;
};

export const acceptRequest = async (requestId) => {
  const response = await axios.post(`/requests/${requestId}/accept`);
  return response.data;
};
