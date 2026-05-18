import api from '../lib/axios';

export const getAllServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const addService = async (data) => {
  const response = await api.post('/services', data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};
