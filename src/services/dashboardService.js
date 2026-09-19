import { apiRequest } from "@/services/api";

export const getDashboardStats = async () => {
  const data = await apiRequest("/dashboard/stats", {
    method: "GET",
  });

  return data.stats;
};