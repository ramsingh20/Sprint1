import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

import AnalyticsKpiCard from "@/features/analytics/components/AnalyticsKpiCard";
import AnalyticsRevenueChart from "@/features/analytics/components/AnalyticsRevenueChart";
import UserAcquisitionChart from "@/features/analytics/components/UserAcquisitionChart";
import TrafficSourceChart from "@/features/analytics/components/TrafficSourceChart";
import { analyticsKpiData, } from "@/features/analytics/data/analyticsData";
import { getAnalyticsRevenue, getAnalyticsStats, getUserAcquisition } from "@/services/analyticsService";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
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
  }, []);

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
  }, [selectedPeriod]);

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
  }, [selectedPeriod]);

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
  }, [selectedPeriod]);

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
        {
          revenueLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground">Loading revenue data...</p>
            </div>
          ) : revenueError ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card p-6">
              <p className="text-sm text-destructive">{revenueError}</p>
            </div>
          ) : (<AnalyticsRevenueChart data={analyticsRevenueData} />)
        }
        
        {
          userAcquisitionLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground">Loading user acquisition data...</p>
            </div>
          ) : userAcquisitionError ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card p-6">
              <p className="text-sm text-destructive">{userAcquisitionError}</p>
            </div>
          ) : (<UserAcquisitionChart data={userAcquisitionData} />)
        }
      </div>

      <div>
        <div>
          {
            trafficSourcesLoading ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
                <p className="text-sm text-muted-foreground">Loading traffic source data...</p>
              </div>
            ) : trafficSourcesError ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card p-6">
                <p className="text-sm text-destructive">{trafficSourcesError}</p>
              </div>
            ) : (<TrafficSourceChart data={trafficSources} />)
          }
        </div>
      </div>

    </div>
  );
};

export default Analytics;