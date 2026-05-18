import { useQuery } from "@tanstack/react-query";
import { getAdminStats, getRevenueStats, getSystemHealth, getActiveJobs, getAllMechanics } from "../api/admin.api";

export const useActiveJobs = () => {
  return useQuery({
    queryKey: ["admin", "active-jobs"],
    queryFn: getActiveJobs,
    refetchInterval: 15000, 
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
    refetchInterval: 30000, 
  });
};

export const useRevenueStats = (timeframe) => {
  return useQuery({
    queryKey: ["admin", "revenue", timeframe],
    queryFn: () => getRevenueStats(timeframe),
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ["admin", "health"],
    queryFn: getSystemHealth,
    refetchInterval: 60000, 
  });
};

export const useAllMechanics = () => {
  return useQuery({
    queryKey: ["admin", "mechanics", "all"],
    queryFn: getAllMechanics,
  });
};
