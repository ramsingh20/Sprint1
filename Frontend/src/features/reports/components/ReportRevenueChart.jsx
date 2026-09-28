import { Card, CardBody, Typography, } from "@material-tailwind/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,XAxis, YAxis, } from "recharts";
const formatCurrency = (value) => {return `₹${value.toLocaleString()}`;};

const ReportRevenueChart = ({ data }) => {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardBody className="p-6">
        <div className="mb-6">
          <Typography variant="h6" className="font-semibold text-foreground">Revenue Performance</Typography>
          <Typography variant="small" className="mt-1 font-normal text-muted-foreground">
            Revenue generated during the selected reporting period.
          </Typography>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0, }}>
            
              <defs>
                <linearGradient id="reportRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopOpacity={0.25} />
                  <stop offset="100%" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={formatCurrency}
                width={70}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value) => [ formatCurrency(value), "Revenue", ]}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))",}}
              />

              <Area type="monotone" dataKey="revenue" strokeWidth={2} fill="url(#reportRevenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default ReportRevenueChart;