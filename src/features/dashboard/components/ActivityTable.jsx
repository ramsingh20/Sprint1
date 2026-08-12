import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, Typography } from "@material-tailwind/react";

const statusStyles = { 
  Completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

const ActivityTable = ({ data }) => {
  return (
    <Card className="overflow-hidden border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div>
          <Typography variant="h6" className="font-semibold">
            Recent Activity
          </Typography>

          <Typography variant="small" className="mt-1 font-normal text-muted-foreground">
            Recent transactions from your customers.
          </Typography>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.id}
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">{item.customer}</p>

                    <p className="text-sm text-muted-foreground">{item.email}</p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {item.date}
                </TableCell>

                <TableCell className="text-right font-medium">
                  {item.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ActivityTable;