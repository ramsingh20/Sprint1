import { apiRequest } from "@/services/api";

const buildRangeQuery = ({ period, startDate, endDate } = {}) => {
  const params = new URLSearchParams();
  if (startDate && endDate) {
    params.set("startDate", startDate);
    params.set("endDate", endDate);
  } else {
    params.set("period", String(period || 30));
  }
  return params.toString();
};

const getDashboardData = async (path, range) => apiRequest(`/dashboard/${path}?${buildRangeQuery(range)}`, { method: "GET" });

export const getDashboardStats = async (range) => (await getDashboardData("stats", range)).stats;
export const getRevenueData = async (range) => (await getDashboardData("revenue", range)).revenue;
export const getUserGrowthData = async (range) => (await getDashboardData("user-growth", range)).userGrowth;
export const getRecentActivity = async (range) => (await getDashboardData("activity", range)).activities;
