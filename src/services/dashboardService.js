import { apiRequest } from "@/services/api";

export const getDashboardStats = async () => {
  const data = await apiRequest("/dashboard/stats", {
    method: "GET",
  });

  return data.stats;
};

export const getRevenueData = async () => {
  const data = await apiRequest("/dashboard/revenue", {
    method: "GET",
  });

  return data.revenue;
};
export const getUserGrowthData = async () => {
  const data = await apiRequest("/dashboard/user-growth", {
    method: "GET",
  });

  return data.userGrowth;
};

export const getRecentActivity = async () => {
  const data = await apiRequest("/dashboard/activity", {
    method: "GET",
  });

  return data.activities;
};