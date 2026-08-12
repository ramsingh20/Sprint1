import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, Typography } from "@material-tailwind/react";

const statusStyles = { 
  Completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

const ActivityTable = ({ data }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase()) || item.customer.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = status === "All" || item.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [data, search, status]);
  return (
    <Card className="overflow-hidden border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <Typography variant="h6" className="font-semibold">
                    Recent Activity
                </Typography>

                <Typography variant="small" className="mt-1 font-normal text-muted-foreground">
                    Recent transactions from your customers.
                </Typography>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input type="text" placeholder="Search transactions..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-64" />
                </div>

                {/* Status */}
                <div className="relative">
                    <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 w-full appearance-none rounded-md border border-input bg-background pl-9 pr-8 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-36">
                        <option value="All">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="border-t border-border px-6 py-3 text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} transactions
        </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map((item) => (
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
            {/* Handle empty results */}
            {filteredData.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    No transactions found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ActivityTable;