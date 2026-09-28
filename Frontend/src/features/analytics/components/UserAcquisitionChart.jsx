import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { Card, Typography } from "@material-tailwind/react";

const UserAcquisitionChart = ({ data }) => {
  return (
    <Card className="border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-6">
        <Typography variant="h6" className="font-semibold">
          User Acquisition
        </Typography>

        <Typography variant="small" className="mt-1 font-normal text-muted-foreground">
          New and returning users over the selected period.
        </Typography>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />

            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="fill-muted-foreground" />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--card)",
              }}
            />

            <Line
              type="monotone"
              dataKey="newUsers"
              name="New Users"
              stroke="currentColor"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              className="text-primary"
            />

            <Line
              type="monotone"
              dataKey="returningUsers"
              name="Returning Users"
              stroke="currentColor"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              className="text-muted-foreground"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default UserAcquisitionChart;