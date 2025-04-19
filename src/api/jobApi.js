import axios from './axiosInstance.js';

export const getAllJobs = async (params = {}) => {
  const response = await axios.get('/api/job', { params });
  return response.data;
};

export const createJob = async (jobData) => {
    const res = await axios.post('/api/job', jobData); // ensure auth token is attached if needed
    return res.data;
};