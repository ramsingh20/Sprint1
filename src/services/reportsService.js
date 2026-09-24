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

export const getReportRevenue = async (period) => {
  const data = await apiRequest(
    `/reports/revenue?period=${period}`,
    {
      method: "GET",
    }
  );

  return data.revenue;
};

export const getReportTable = async (period) => {
  const data = await apiRequest(
    `/reports/table?period=${period}`,
    {
      method: "GET",
    }
  );

  return data.reports;
};