import api from '../lib/axios';

export const createPaymentOrder = async (data) => {
  const response = await api.post('/payments/create-order', data);
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payments/verify', paymentData);
  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get('/payments/my');
  return response.data;
};

export const getPaymentBreakdown = async (id) => {
  const response = await api.get(`/payments/${id}/breakdown`);
  return response.data;
};

export const downloadInvoice = async (id) => {
  const response = await api.get(`/payments/${id}/invoice`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getAllPayments = async () => {
  const response = await api.get('/payments/admin/all');
  return response.data;
};
