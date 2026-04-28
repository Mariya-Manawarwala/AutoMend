import axios from '../lib/axios';

export const getMyVehicles = async () => {
  const response = await axios.get('/vehicles/my');
  return response.data;
};

export const addVehicle = async (vehicleData) => {
  const response = await axios.post('/vehicles', vehicleData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
