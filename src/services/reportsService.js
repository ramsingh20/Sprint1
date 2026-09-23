import { apiRequest } from "@/services/api";

export const getReportStats = async (period) => {
  const data = await apiRequest(
    `/reports/stats?period=${period}`,
    {
      method: "GET",
    }
  );

  return data.stats;
};