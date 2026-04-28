import axios from '../lib/axios';

export const createOrder = async (orderData) => {
  const response = await axios.post('/payments/create-order', orderData);
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axios.post('/payments/verify', paymentData);
  return response.data;
};

export const getMechanicEarnings = async (month, year) => {
  const response = await axios.get(`/payments/mechanic?month=${month}&year=${year}`);
  return response.data;
};
