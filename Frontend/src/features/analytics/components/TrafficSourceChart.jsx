import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, } from "recharts";
import { Card, Typography } from "@material-tailwind/react";

const chartColors = [
  "hsl(var(--primary))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--accent-foreground))",
  "hsl(var(--border))",
];

const TrafficSourceChart = ({ data }) => {
  return (
    <Card className="border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-6">
        <Typography variant="h6" className="font-semibold">
          Traffic Sources
        </Typography>

        <Typography variant="small" className="mt-1 font-normal text-muted-foreground">
          Where your users are coming from.
        </Typography>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-2">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Traffic",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />

                <span className="text-sm font-medium">{item.name}</span>
              </div>

              <span className="text-sm font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TrafficSourceChart;