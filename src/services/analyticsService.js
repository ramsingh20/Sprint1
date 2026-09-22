import { apiRequest } from "@/services/api";

export const getAnalyticsStats = async () => {
  const data = await apiRequest("/analytics/stats", {
    method: "GET",
  });

  return data.stats;
};

export const getAnalyticsRevenue = async (period) => {
  const data = await apiRequest(
    `/analytics/revenue?period=${period}`,
    {
      method: "GET",
    }
  );

  return data.revenue;
};
export const getUserAcquisition = async (period) => {
  const data = await apiRequest(
    `/analytics/user-acquisition?period=${period}`,
    {
      method: "GET",
    }
  );

  return data.userAcquisition;
};