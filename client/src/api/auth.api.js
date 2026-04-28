import axios from '../lib/axios';

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  // Optional: Add backend logout if session management is used
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};
