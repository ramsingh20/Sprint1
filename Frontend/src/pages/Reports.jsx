import { CalendarDays, Download } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import ErrorState from "@/components/common/ErrorState";
import ChartSkeleton from "@/components/common/ChartSkeleton";
import DataTableSkeleton from "@/components/common/DataTableSkeleton";
import ReportKpiCard from "@/features/reports/components/ReportKpiCard";
import { reportKpiData, } from "@/features/reports/data/reportsData";
import ReportRevenueChart from "@/features/reports/components/ReportRevenueChart";
import ReportTable from "@/features/reports/components/ReportTable";
import { exportToCsv } from "@/utils/exportCsv";
import { getReportRevenue, getReportStats, getReportTable } from "@/services/reportsService";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");

  const [reportStats, setReportStats] = useState(null);
  const [reportStatsLoading, setReportStatsLoading] = useState(true);
  const [reportStatsError, setReportStatsError] = useState("");

  const [reportRevenue, setReportRevenue] = useState([]);
  const [reportRevenueLoading, setReportRevenueLoading] = useState(true);
  const [reportRevenueError, setReportRevenueError] = useState("");

  const [reportTableData, setReportTableData] = useState([]);
  const [reportTableLoading, setReportTableLoading] = useState(true);
  const [reportTableError, setReportTableError] = useState("");

  const filteredReports = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return reportTableData.filter((item) => item.date.toLowerCase().includes(searchValue));
  }, [reportTableData, search]);

  const handleExport = () => {
    const exportData = filteredReports.map((item) => ({
      Date: item.date,
      Orders: item.orders,
      Revenue: item.revenue,
      Customers: item.customers,
      "Average Order Value": item.orders > 0 ? (item.revenue / item.orders).toFixed(2) : "0.00",
    }));

    if (exportData.length === 0) { return; }
    exportToCsv(`pulseboard-report-${selectedPeriod}-days.csv`, exportData );
  };

  useEffect(() => {
    const loadReportStats = async () => {
      try {
        setReportStatsLoading(true);
        setReportStatsError("");

        const stats = await getReportStats(selectedPeriod);

        setReportStats(stats);
      } catch (error) {
        console.error(
          "Failed to load report statistics:",
          error
        );

        setReportStatsError(
          error.message || "Failed to load report statistics"
        );
      } finally {
        setReportStatsLoading(false);
      }
    };

    loadReportStats();
  }, [selectedPeriod, reloadKey]);

  useEffect(() => {
    const loadReportRevenue = async () => {
      try {
        setReportRevenueLoading(true);
        setReportRevenueError("");

        const data = await getReportRevenue(selectedPeriod);
        setReportRevenue(data);
      } catch (error) {
        console.error("Failed to load report revenue:",error);
        setReportRevenueError(error.message || "Failed to load report revenue");
      } finally {
        setReportRevenueLoading(false);
      }
    };

    loadReportRevenue();
  }, [selectedPeriod, reloadKey]);

  useEffect(() => {
    const loadReportTable = async () => {
      try {
        setReportTableLoading(true);
        setReportTableError("");

        const data = await getReportTable(selectedPeriod);
        setReportTableData(data);
      } catch (error) {
        console.error("Failed to load report table:", error);
        setReportTableError(error.message || "Failed to load report table");
      } finally {
        setReportTableLoading(false);
      }
    };

    loadReportTable();
  }, [selectedPeriod, reloadKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Reports" description="Generate and analyze detailed business reports." />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <select
              id="reports-period"
              aria-label="Reports date range"
              value={selectedPeriod}
              onChange={(event) =>setSelectedPeriod(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="size-4" />Export
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportKpiData.map((item) => {
          let value = 0;

          if (item.title === "Total Revenue") {
            value = reportStats?.totalRevenue ?? 0;
          }
          if (item.title === "Total Orders") {
            value = reportStats?.totalOrders ?? 0;
          }
          if (item.title === "Total Customers") {
            value = reportStats?.totalCustomers ?? 0;
          }
          if (item.title === "Average Order Value") {
            value = reportStats?.averageOrderValue ?? 0;
          }

          return (
            <ReportKpiCard key={item.title} {...item}
              loading={reportStatsLoading}
              value={ item.title === "Total Revenue" || item.title === "Average Order Value" ? `$${Number(value).toLocaleString()}` : value}
            />
          );
        })}
      </div>
      {reportStatsError && <ErrorState message={reportStatsError} onRetry={() => setReloadKey((value) => value + 1)} />}
      <div className="grid gap-6">
        {
          reportRevenueLoading ? (
            <ChartSkeleton title="Loading report revenue" />
          ) : reportRevenueError ? (
            <ErrorState message={reportRevenueError} className="min-h-[300px]" onRetry={() => setReloadKey((value) => value + 1)} />
          ) : (<ReportRevenueChart data={reportRevenue} />)
        }
        {
          reportTableLoading ? (
            <DataTableSkeleton columns={5} rows={6} />
          ) : reportTableError ? (
            <ErrorState message={reportTableError} className="min-h-[300px]" onRetry={() => setReloadKey((value) => value + 1)} />
          ) : (<ReportTable data={reportTableData} search={search} onSearchChange={setSearch} />)
        }
      </div>
    </div>
  );
};

export default Reports;



