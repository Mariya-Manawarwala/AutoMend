import axios from "../lib/axios";

export const getAdminStats = async () => {
  const { data } = await axios.get("/admin/dashboard");
  return data;
};

export const getRevenueStats = async (timeframe) => {
  const { data } = await axios.get(`/admin/dashboard/revenue-stats?timeframe=${timeframe}`);
  return data;
};

export const getSystemHealth = async () => {
  const { data } = await axios.get("/admin/dashboard/health");
  return data;
};

export const getPendingMechanics = async () => {
  const { data } = await axios.get("/admin/dashboard/mechanics/pending");
  return data;
};

export const getActiveJobs = async () => {
  const { data } = await axios.get("/admin/dashboard/active-jobs");
  return data;
};

export const getAllMechanics = async () => {
  const { data } = await axios.get("/admin/dashboard/mechanics");
  return data;
};
