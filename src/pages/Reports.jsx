import { CalendarDays, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import ReportKpiCard from "@/features/reports/components/ReportKpiCard";
import { reportKpiData, reportRevenueData, reportTableData, } from "@/features/reports/data/reportsData";
import ReportRevenueChart from "@/features/reports/components/ReportRevenueChart";
import ReportTable from "@/features/reports/components/ReportTable";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PageHeader title="Reports" description="Generate and analyze detailed business reports." />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <select
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
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />Export
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportKpiData.map((item) => (
          <ReportKpiCard
            key={item.title}
            {...item}
          />
        ))}
      </div>
      <div className="grid gap-6">
        <ReportRevenueChart data={reportRevenueData[selectedPeriod]} />
        <ReportTable data={reportTableData} />
      </div>
    </div>
  );
};

export default Reports;