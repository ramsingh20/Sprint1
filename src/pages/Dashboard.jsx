import PageHeader from "@/components/common/PageHeader";
import ActivityTable from "@/features/dashboard/components/ActivityTable";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import StatsCard from "@/features/dashboard/components/StatsCard";
import UserGrowthChart from "@/features/dashboard/components/UserGrowthChart";
import { statsData } from "@/features/dashboard/data/dashboardData";
import { getDashboardStats, getRecentActivity, getRevenueData, getUserGrowthData } from "@/services/dashboardService";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const formatInputDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const formatPercentChange = (value) => value === null ? "New" : `${value > 0 ? "+" : ""}${value}%`;
const isValidCustomRange = (start, end) => {
  if (!start || !end) return false;
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end}T00:00:00Z`);
  const days = (last - first) / 86_400_000 + 1;
  return Number.isFinite(first) && Number.isFinite(last)
    && new Date(first).toISOString().slice(0, 10) === start
    && new Date(last).toISOString().slice(0, 10) === end && days > 0 && days <= 366;
};

const Dashboard = () => {
  const [activeRange, setActiveRange] = useState({ period: 30 });
  const [rangeMode, setRangeMode] = useState("30");
  const now = new Date();
  const [customEndDate, setCustomEndDate] = useState(formatInputDate(now));
  const [customStartDate, setCustomStartDate] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return formatInputDate(start);
  });
  const [customRangeError, setCustomRangeError] = useState("");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revenueData, setRevenueData] = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState("");
  const [customerGrowthData, setCustomerGrowthData] = useState([]);
  const [customerGrowthLoading, setCustomerGrowthLoading] = useState(true);
  const [customerGrowthError, setCustomerGrowthError] = useState("");
  const [activityData, setActivityData] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDashboardData = async () => {
      setLoading(true);
      setRevenueLoading(true);
      setCustomerGrowthLoading(true);
      setActivityLoading(true);
      setError("");
      setRevenueError("");
      setCustomerGrowthError("");
      setActivityError("");
      try {
        const [stats, revenue, customerGrowth, activity] = await Promise.all([
          getDashboardStats(activeRange),
          getRevenueData(activeRange),
          getUserGrowthData(activeRange),
          getRecentActivity(activeRange),
        ]);
        if (!active) return;
        setDashboardStats(stats);
        setRevenueData(revenue);
        setCustomerGrowthData(customerGrowth);
        setActivityData(activity);
      } catch (loadError) {
        if (!active) return;
        const message = loadError.message || "Failed to load dashboard data";
        setError(message);
        setRevenueError(message);
        setCustomerGrowthError(message);
        setActivityError(message);
      } finally {
        if (active) {
          setLoading(false);
          setRevenueLoading(false);
          setCustomerGrowthLoading(false);
          setActivityLoading(false);
        }
      }
    };
    loadDashboardData();
    return () => { active = false; };
  }, [activeRange]);

  const periodLabel = activeRange.period
    ? `the last ${activeRange.period} days`
    : `${activeRange.startDate} to ${activeRange.endDate}`;
  const applyCustomRange = () => {
    if (!isValidCustomRange(customStartDate, customEndDate)) {
      setCustomRangeError("Choose a valid date range of 1 to 366 days.");
      return;
    }
    setCustomRangeError("");
    setActiveRange({ startDate: customStartDate, endDate: customEndDate });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Dashboard" description="Business performance from your orders and customers." />
      <section className="rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label htmlFor="dashboard-period" className="mb-1 block text-sm font-medium">Dashboard date range</label>
            <select id="dashboard-period" value={rangeMode} onChange={(event) => {
              const nextRange = event.target.value;
              setRangeMode(nextRange);
              setCustomRangeError("");
              if (nextRange !== "custom") setActiveRange({ period: Number(nextRange) });
            }} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
              <option value="custom">Custom dates</option>
            </select>
          </div>
          {rangeMode === "custom" && (
            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs text-muted-foreground">From<input aria-label="Start date" type="date" value={customStartDate} max={customEndDate} onChange={(event) => setCustomStartDate(event.target.value)} className="mt-1 block h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label>
              <label className="text-xs text-muted-foreground">To<input aria-label="End date" type="date" value={customEndDate} min={customStartDate} onChange={(event) => setCustomEndDate(event.target.value)} className="mt-1 block h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" /></label>
              <Button onClick={applyCustomRange}>Apply dates</Button>
            </div>
          )}
        </div>
        {customRangeError && <p role="alert" className="mt-2 text-sm text-destructive">{customRangeError}</p>}
        <p className="mt-2 text-xs text-muted-foreground">Comparisons use the immediately preceding period of the same length.</p>
      </section>

      {error && <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const value = dashboardStats?.[stat.key] ?? 0;
          const change = dashboardStats?.changes?.[stat.key];
          const formattedChange = stat.key === "orderCompletionRate"
            ? `${change > 0 ? "+" : ""}${Number(change ?? 0).toFixed(1)} pp`
            : formatPercentChange(change === undefined ? 0 : change);
          return (
            <StatsCard key={stat.key} {...stat}
              value={loading ? "Loading..." : !dashboardStats ? "—" : stat.key === "totalRevenue" ? `$${Number(value).toLocaleString()}` : stat.key === "orderCompletionRate" ? `${Number(value).toFixed(1)}%` : Number(value).toLocaleString()}
              change={loading || !dashboardStats ? "" : formattedChange}
              description={loading ? "Loading selected range" : "vs previous period"}
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {revenueLoading ? <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card"><p className="text-sm text-muted-foreground">Loading revenue data...</p></div>
          : revenueError ? <div role="alert" className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card p-6"><p className="text-sm text-destructive">{revenueError}</p></div>
            : <RevenueChart data={revenueData} periodLabel={periodLabel} />}
        {customerGrowthLoading ? <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card"><p className="text-sm text-muted-foreground">Loading customer growth...</p></div>
          : customerGrowthError ? <div role="alert" className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card p-6"><p className="text-sm text-destructive">{customerGrowthError}</p></div>
            : <UserGrowthChart data={customerGrowthData} periodLabel={periodLabel} />}
      </div>

      {activityLoading ? <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card"><p className="text-sm text-muted-foreground">Loading recent activity...</p></div>
        : activityError ? <div role="alert" className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card p-6"><p className="text-sm text-destructive">{activityError}</p></div>
          : <ActivityTable key={periodLabel} data={activityData} periodLabel={periodLabel} />}
    </div>
  );
};

export default Dashboard;



