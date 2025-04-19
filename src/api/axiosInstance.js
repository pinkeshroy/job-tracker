import axios from 'axios';
console.log({REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL})
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
