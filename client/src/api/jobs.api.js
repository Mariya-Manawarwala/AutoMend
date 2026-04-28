import axios from '../lib/axios';

export const getJobByRequestId = async (requestId) => {
  const response = await axios.get(`/jobs/${requestId}`);
  return response.data;
};

export const updateJob = async (jobId, jobData) => {
  const response = await axios.patch(`/jobs/${jobId}`, jobData);
  return response.data;
};

export const submitBill = async (jobId) => {
  const response = await axios.put(`/jobs/${jobId}/submit-bill`);
  return response.data;
};

export const applyCoupon = async (jobId, couponCode) => {
  const response = await axios.post(`/jobs/${jobId}/apply-coupon`, { couponCode });
  return response.data;
};
