import { apiRequest } from "@/services/api";

export const getAnalyticsStats = async () => {
  const data = await apiRequest("/analytics/stats", {
    method: "GET",
  });

  return data.stats;
};