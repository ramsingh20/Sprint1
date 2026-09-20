import PageHeader from "@/components/common/PageHeader";
import ActivityTable from "@/features/dashboard/components/ActivityTable";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import StatsCard from "@/features/dashboard/components/StatsCard";
import UserGrowthChart from "@/features/dashboard/components/UserGrowthChart";

import { activityData, statsData, } from "@/features/dashboard/data/dashboardData";
import { getDashboardStats, getRevenueData, getUserGrowthData } from "@/services/dashboardService";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [revenueData, setRevenueData] = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState("");

  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userGrowthLoading, setUserGrowthLoading] = useState(true);
  const [userGrowthError, setUserGrowthError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setRevenueLoading(true);
        setUserGrowthLoading(true);

        setError("");
        setRevenueError("");
        setUserGrowthError("");
        const [stats, revenue, userGrowth] = await Promise.all([getDashboardStats(), getRevenueData(), getUserGrowthData(),]);

        setDashboardStats(stats);
        setRevenueData(revenue);
        setUserGrowthData(userGrowth);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setError(error.message || "Failed to load dashboard data");
        setRevenueError(error.message || "Failed to load revenue data");
        setUserGrowthError(error.message || "Failed to load user growth data");

      } finally {
        setLoading(false);
        setRevenueLoading(false);
        setUserGrowthLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  
  return (
    <div className="space-y-6 p-6">

      <PageHeader title="Dashboard" description="Overview of your business performance." />
      
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          let value = 0;

          if (stat.title === "Total Revenue") {
            value = dashboardStats?.totalRevenue ?? 0;
          }
          if (stat.title === "Active Users") {
            value = dashboardStats?.activeUsers ?? 0;
          }
          if (stat.title === "Total Orders") {
            value = dashboardStats?.totalOrders ?? 0;
          }
          if (stat.title === "Conversion Rate") {
            value = "—";
          }

          return (
            <StatsCard key={stat.title} {...stat} 
              value={loading ? "Loading..." : stat.title === "Total Revenue" ? `$${Number(value).toLocaleString()}` : value}
            />
          );
        })}
      </div>

      {/* Analytics */}
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
          ) : (<RevenueChart data={revenueData} />)
        }
        
        {
          userGrowthLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
              <p className="text-sm text-muted-foreground">Loading user growth data...</p>
            </div>
          ) : userGrowthError ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card p-6">
              <p className="text-sm text-destructive">{userGrowthError}</p>
            </div>
          ) : (<UserGrowthChart data={userGrowthData} />)
        }

      </div>

      <ActivityTable data={activityData} />   {/* Recent Activity */}

    </div>
  );
};

export default Dashboard;