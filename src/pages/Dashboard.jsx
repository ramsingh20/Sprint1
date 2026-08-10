import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { statsData } from "@/features/dashboard/data/dashboardData";

const Dashboard = () => {
  return (
    <div className="space-y-6 p-6">

      <PageHeader
        title="Dashboard"
        description="Overview of your business performance."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

    </div>
  );
};

export default Dashboard;