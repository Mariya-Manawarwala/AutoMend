import api from '../lib/axios';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  // Check if userData is FormData, if not, handle accordingly
  const isFormData = userData instanceof FormData;
  const response = await api.post('/auth/register', userData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
    }
  });
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

export const logoutUser = async () => {
  // Optional: Add backend logout if needed
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
