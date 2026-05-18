import api from '../lib/axios';

export const getMyJobs = async (status = 'active') => {
  const response = await api.get(`/jobs/my?status=${status}`);
  return response.data;
};

export const getJobDetails = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const updateJobStatus = async (id, status) => {
  const response = await api.patch(`/jobs/${id}/status`, { status });
  return response.data;
};

export const addServicesToJob = async (id, services) => {
  const response = await api.post(`/jobs/${id}/services`, { services });
  return response.data;
};

export const submitBill = async (id, data) => {
  const response = await api.put(`/jobs/${id}/submit-bill`, data);
  return response.data;
};

export const updateMechanicLocation = async (id, location) => {
  const response = await api.patch(`/jobs/${id}/location`, location);
  return response.data;
};

export const getMechanicEarnings = async () => {
  const response = await api.get('/jobs/mechanic/earnings');
  return response.data;
};

export const generateFinalInvoice = async (id) => {
  const response = await api.post(`/jobs/${id}/generate-invoice`);
  return response.data;
};
