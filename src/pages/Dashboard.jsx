import PageHeader from "@/components/common/PageHeader";
import ActivityTable from "@/features/dashboard/components/ActivityTable";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import StatsCard from "@/features/dashboard/components/StatsCard";
import UserGrowthChart from "@/features/dashboard/components/UserGrowthChart";

import { activityData, revenueData, statsData, userGrowthData, } from "@/features/dashboard/data/dashboardData";
import { getDashboardStats } from "@/services/dashboardService";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDashboardStats();
        setDashboardStats(data);

      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        setError(error.message || "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);
  
  return (
    <div className="space-y-6 p-6">

      <PageHeader title="Dashboard" description="Overview of your business performance." />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">

        <RevenueChart data={revenueData} />
        <UserGrowthChart data={userGrowthData} />

      </div>

      <ActivityTable data={activityData} />   {/* Recent Activity */}

    </div>
  );
};

export default Dashboard;