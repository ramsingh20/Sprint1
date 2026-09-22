import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

import AnalyticsKpiCard from "@/features/analytics/components/AnalyticsKpiCard";
import AnalyticsRevenueChart from "@/features/analytics/components/AnalyticsRevenueChart";
import UserAcquisitionChart from "@/features/analytics/components/UserAcquisitionChart";
import TrafficSourceChart from "@/features/analytics/components/TrafficSourceChart";
import { analyticsKpiData, analyticsRevenueData, trafficSourceData, userAcquisitionData, } from "@/features/analytics/data/analyticsData";
import { getAnalyticsStats } from "@/services/analyticsService";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalyticsStats = async () => {
      try {
        setLoading(true);
        setError("");

        const stats = await getAnalyticsStats();

        setAnalyticsStats(stats);
      } catch (error) {
        console.error("Failed to load analytics statistics:", error);

        setError(
          error.message || "Failed to load analytics statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsStats();
  }, []);

  return (
    <div className="space-y-6 p-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Analytics" description="Track your business performance and growth." />

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />

          <select value={selectedPeriod} onChange={(event) =>setSelectedPeriod(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsKpiData.map((item) => {
          let value = 0;

          if (item.title === "Total Customers") {
            value = analyticsStats?.totalCustomers ?? 0;
          }
          if (item.title === "Total Orders") {
            value = analyticsStats?.totalOrders ?? 0;
          }
          if (item.title === "Conversion Rate") {
            value = analyticsStats?.conversionRate ?? 0;
          }

          return (
            <AnalyticsKpiCard
              key={item.title}
              {...item}
              value={
                loading ? "Loading..." : item.title === "Conversion Rate" ? `${Number(value).toFixed(1)}%` : value
              }
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsRevenueChart data={analyticsRevenueData[selectedPeriod]} />
        <UserAcquisitionChart data={userAcquisitionData[selectedPeriod]} />
      </div>

      <div>
        <TrafficSourceChart data={trafficSourceData[selectedPeriod]} />
      </div>

    </div>
  );
};

export default Analytics;