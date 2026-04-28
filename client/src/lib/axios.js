import axios from 'axios';

// Base URL from user request
const baseURL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401 && !error.config.url.includes('/auth/')) {
      // Unauthorized: Clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }

    // You can also add global toast errors here if you have a toast library
    // For example: toast.error(error.response?.data?.message || 'Something went wrong');

    return Promise.reject(error);
  }
);

export default axiosInstance;
