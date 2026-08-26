import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Card, Typography } from "@material-tailwind/react";
const ITEMS_PER_PAGE = 6;

const ReportTable = ({ data, search, onSearchChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return data.slice( startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const formatCurrency = (value) => {return `$${value.toLocaleString()}`;};

  const getAverageOrderValue = (item) => {
    return item.orders > 0 ? item.revenue / item.orders : 0;
  };

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h6" className="font-semibold text-foreground">Report Details</Typography>

          <Typography variant="small" className="mt-1 font-normal text-muted-foreground">
            Detailed breakdown of your business performance.
          </Typography>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-64"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Customers</TableHead>

              <TableHead className="text-right">Avg. Order</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.date}</TableCell>

                <TableCell className="text-right">{item.orders.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(item.revenue)}</TableCell>

                <TableCell className="text-right">{item.customers.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(getAverageOrderValue(item))}
                </TableCell>
              </TableRow>
            ))}

            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="small" className="font-normal text-muted-foreground">
          Showing{" "} {paginatedData.length} of{" "} {data.length} reports
        </Typography>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="rounded-md border border-input px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
          <button
            type="button"
            disabled={ currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="rounded-md border border-input px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ReportTable;