import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Typography } from "@material-tailwind/react";

const UserGrowthChart = ({ data, periodLabel }) => (
  <Card className="border border-border bg-card p-6 text-card-foreground shadow-sm">
    <div className="mb-6">
      <Typography variant="h6" className="font-semibold">Customer Growth</Typography>
      <Typography variant="small" className="mt-1 font-normal text-muted-foreground">New customer accounts during {periodLabel}.</Typography>
    </div>
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} minTickGap={12} />
          <YAxis axisLine={false} tickLine={false} tickMargin={10} allowDecimals={false} />
          <Tooltip formatter={(value) => [Number(value).toLocaleString(), "New customers"]} />
          <Line type="monotone" dataKey="users" stroke="currentColor" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default UserGrowthChart;
