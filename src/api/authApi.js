import axios from './axiosInstance.js';

// POST: Login user
export const loginUser = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

// POST: Register user
export const registerUser = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  return response.data;
};