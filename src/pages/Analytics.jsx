import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ErrorState from "@/components/common/ErrorState";
import ChartSkeleton from "@/components/common/ChartSkeleton";

import AnalyticsKpiCard from "@/features/analytics/components/AnalyticsKpiCard";
import AnalyticsRevenueChart from "@/features/analytics/components/AnalyticsRevenueChart";
import UserAcquisitionChart from "@/features/analytics/components/UserAcquisitionChart";
import TrafficSourceChart from "@/features/analytics/components/TrafficSourceChart";
import { analyticsKpiData, } from "@/features/analytics/data/analyticsData";
import { getAnalyticsRevenue, getAnalyticsStats, getTrafficSources, getUserAcquisition } from "@/services/analyticsService";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [reloadKey, setReloadKey] = useState(0);
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [analyticsRevenueData, setAnalyticsRevenueData] = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState("");

  const [userAcquisitionData, setUserAcquisitionData] = useState([]);
  const [userAcquisitionLoading, setUserAcquisitionLoading] = useState(true);
  const [userAcquisitionError, setUserAcquisitionError] = useState("");

  const [trafficSources, setTrafficSources] = useState([]);
  const [trafficSourcesLoading, setTrafficSourcesLoading] = useState(true);
  const [trafficSourcesError, setTrafficSourcesError] = useState("");

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
  }, [reloadKey]);

  useEffect(() => {
    const loadAnalyticsRevenue = async () => {
      try {
        setRevenueLoading(true);
        setRevenueError("");
        const revenue = await getAnalyticsRevenue(selectedPeriod);

        setAnalyticsRevenueData(revenue);
      } catch (error) {
        console.error("Failed to load analytics revenue:", error);
        setRevenueError(error.message || "Failed to load revenue data");
      } finally {
        setRevenueLoading(false);
      }
    };

    loadAnalyticsRevenue();
  }, [selectedPeriod, reloadKey]);

  useEffect(() => {
    const loadUserAcquisition = async () => {
      try {
        setUserAcquisitionLoading(true);
        setUserAcquisitionError("");

        const data = await getUserAcquisition(selectedPeriod);
        setUserAcquisitionData(data);
      } catch (error) {
        console.error("Failed to load user acquisition data:", error);
        setUserAcquisitionError(error.message || "Failed to load user acquisition data");
      } finally {
        setUserAcquisitionLoading(false);
      }
    };

    loadUserAcquisition();
  }, [selectedPeriod, reloadKey]);

  useEffect(() => {
    const loadTrafficSources = async () => {
      try {
        setTrafficSourcesLoading(true);
        setTrafficSourcesError("");

        const data = await getTrafficSources(selectedPeriod);

        setTrafficSources(data);
      } catch (error) {
        console.error(
          "Failed to load traffic source data:",
          error
        );

        setTrafficSourcesError(
          error.message || "Failed to load traffic source data"
        );
      } finally {
        setTrafficSourcesLoading(false);
      }
    };

    loadTrafficSources();
  }, [selectedPeriod, reloadKey]);

  return (
    <div className="space-y-6 p-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Analytics" description="Track your business performance and growth." />

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />

          <select aria-label="Analytics date range" value={selectedPeriod} onChange={(event) =>setSelectedPeriod(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)} />}
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
              loading={loading}
              value={item.title === "Conversion Rate" ? `${Number(value).toFixed(1)}%` : value}
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {
          revenueLoading ? (
            <ChartSkeleton title="Loading analytics revenue" />
          ) : revenueError ? (
            <ErrorState message={revenueError} className="min-h-[300px]" onRetry={() => setReloadKey((value) => value + 1)} />
          ) : (<AnalyticsRevenueChart data={analyticsRevenueData} />)
        }
        
        {
          userAcquisitionLoading ? (
            <ChartSkeleton title="Loading customer acquisition" />
          ) : userAcquisitionError ? (
            <ErrorState message={userAcquisitionError} className="min-h-[300px]" onRetry={() => setReloadKey((value) => value + 1)} />
          ) : (<UserAcquisitionChart data={userAcquisitionData} />)
        }
      </div>

      <div>
        <div>
          {
            trafficSourcesLoading ? (
              <ChartSkeleton title="Loading traffic sources" />
            ) : trafficSourcesError ? (
              <ErrorState message={trafficSourcesError} className="min-h-[300px]" onRetry={() => setReloadKey((value) => value + 1)} />
            ) : (<TrafficSourceChart data={trafficSources} />)
          }
        </div>
      </div>

    </div>
  );
};

export default Analytics;



