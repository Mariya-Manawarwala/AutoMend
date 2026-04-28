import axios from '../lib/axios';

export const getMyProfile = async () => {
  const response = await axios.get('/profile/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axios.put('/profile/update', profileData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteAccount = async () => {
  const response = await axios.delete('/profile/delete');
  return response.data;
};
