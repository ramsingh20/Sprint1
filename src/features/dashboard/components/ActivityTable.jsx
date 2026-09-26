import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, Typography } from "@material-tailwind/react";

const statusStyles = { 
  Completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

const SortIcon = ({ column, sortConfig }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="ml-1 h-3.5 w-3.5" />;
    return sortConfig.direction === "asc"
        ? <ArrowUp className="ml-1 h-3.5 w-3.5" />
        : <ArrowDown className="ml-1 h-3.5 w-3.5" />;
};
const ActivityTable = ({ data, periodLabel }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [sortConfig, setSortConfig] = useState({ 
        key: null, 
        direction: "asc",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const filteredData = useMemo(() => {
        const filtered = data.filter((item) => {
            const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase()) || item.customer.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = status === "All" || item.status === status;

            return matchesSearch && matchesStatus;
        });

        if (!sortConfig.key) {
            return filtered;
        }

        return [...filtered].sort((a, b) => {
            const first = a[sortConfig.key];
            const second = b[sortConfig.key];

            if (sortConfig.key === "amount") {
            const firstAmount = Number(
                first.replace(/[$,]/g, "")
            );
            const secondAmount = Number(
                second.replace(/[$,]/g, "")
            );

            return sortConfig.direction === "asc" ? firstAmount - secondAmount : secondAmount - firstAmount;}

            if (sortConfig.key === "date") {
                const firstDate = new Date(first);
                const secondDate = new Date(second);

                return sortConfig.direction === "asc" ? firstDate - secondDate : secondDate - firstDate;
            }

            return sortConfig.direction === "asc" ? first.localeCompare(second) : second.localeCompare(first);
        });
    }, [data, search, status, sortConfig]);

    const handleSort = (key) => {
        setCurrentPage(1);
        setSortConfig((current) => {
            if (current.key === key) {
                return { key, direction: current.direction === "asc" ? "desc" : "asc", };
            }
            return { key, direction: "asc",};
        });
    };

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;

        return filteredData.slice(startIndex,startIndex + rowsPerPage);
    }, [filteredData, currentPage]);


  return (
    <Card className="overflow-hidden border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <Typography variant="h6" className="font-semibold">
                    Recent Activity
                </Typography>

                <Typography variant="small" className="mt-1 font-normal text-muted-foreground">
                    Recent transactions during {periodLabel}.
                </Typography>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input aria-label="Search recent activity" type="text" placeholder="Search transactions..." value={search} onChange={(event) => {setSearch(event.target.value); setCurrentPage(1)}} className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-64" />
                </div>

                {/* Status */}
                <div className="relative">
                    <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <select aria-label="Filter recent activity by status" value={status} onChange={(event) => {setStatus(event.target.value); setCurrentPage(1)}} className="h-9 w-full appearance-none rounded-md border border-input bg-background pl-9 pr-8 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-36">
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
            <Table aria-label="Recent order activity">
            <TableHeader>
                <TableRow>
                <TableHead>
                    <button type="button" onClick={() => handleSort("id")} className="inline-flex items-center font-medium hover:text-foreground">
                        Transaction <SortIcon column="id" sortConfig={sortConfig} />
                    </button>
                </TableHead>
                <TableHead>
                    <button type="button" onClick={() => handleSort("customer")} className="inline-flex items-center font-medium hover:text-foreground">
                        Customer<SortIcon column="customer" sortConfig={sortConfig} />
                    </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                    <button type="button" onClick={() => handleSort("date")} className="inline-flex items-center font-medium hover:text-foreground">
                        Date<SortIcon column="date" sortConfig={sortConfig} />
                    </button>
                </TableHead>
                <TableHead className="text-right">
                    <button type="button" onClick={() => handleSort("amount")} className="ml-auto inline-flex items-center font-medium hover:text-foreground">
                        Amount <SortIcon column="amount" sortConfig={sortConfig} />
                    </button>
                </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {paginatedData.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>

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

                    <TableCell className="text-muted-foreground">{new Date(item.date).toLocaleDateString()}</TableCell>

                    <TableCell className="text-right font-medium">{item.amount}</TableCell>
                </TableRow>
                ))}
                {/* Handle empty results */}
                {filteredData.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No transactions found.</TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Showing{" "}{filteredData.length === 0 ? 0: (currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage,filteredData.length)}{" "}
                of {filteredData.length} transactions
            </p>

            <div className="flex items-center gap-2">
                <button type="button" disabled={currentPage === 1} onClick={() =>
                    setCurrentPage((page) => page - 1)
                }
                className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                >Previous</button>

                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>

                <button type="button" disabled={currentPage === totalPages} onClick={() =>
                    setCurrentPage((page) => page + 1)
                }
                className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                >
                Next
                </button>
            </div>
        </div>
    </Card>
  );
};

export default ActivityTable;



