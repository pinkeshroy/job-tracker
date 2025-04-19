import axios from './axiosInstance.js';

// POST: Login user
export const loginUser = async (email, password) => {
  const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
  return response.data; // should return { token: "..." }
};

// POST: Register user
export const registerUser = async (userData) => {
  const response = await axios.post('http://localhost:5001/api/auth/register', userData);
  return response.data; // should return { token: "..." } or success msg
};