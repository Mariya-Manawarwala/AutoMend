import api from '../lib/axios';

export const getMyVehicles = async () => {
  const response = await api.get('/vehicles/my');
  return response.data;
};

export const addVehicle = async (vehicleData) => {
  // Using FormData if there's an image, otherwise JSON
  const isFormData = vehicleData instanceof FormData;
  const response = await api.post('/vehicles', vehicleData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const updateVehicle = async ({ id, vehicleData }) => {
  const isFormData = vehicleData instanceof FormData;
  const response = await api.put(`/vehicles/${id}`, vehicleData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};
