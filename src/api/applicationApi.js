import axios from "./axiosInstance.js";

export const applyToJob = async (jobId, applicationData) => {
  const response = await axios.post(`/api/job/${jobId}/apply`, applicationData);
  return response.data;
};

export const getAllApplications = async ({
  page = 1,
  limit = 10,
  status = "",
  sortBy = "appliedAt",
  order = "desc",
}) => {
  const params = {
    page,
    limit,
    sortBy,
    order,
  };
  if (status) params.status = status;

  const response = await axios.get("/api/job/applications", { params });
  return response.data;
};

export const updateApplication = async (applicationId, updatedFields) => {
  const response = await axios.put(
    `/api/job/applications/${applicationId}`,
    updatedFields
  );
  return response.data;
};

export const deleteApplication = async (id) => {
  const res = await axios.delete(`/api/job/applications/${id}`);
  return res.data;
};

export const getApplicationsForJob = async (jobId, query = {}) => {
  const response = await axios.get(`/api/job/${jobId}/applications`, {
    params: query,
  });
  return response.data;
};