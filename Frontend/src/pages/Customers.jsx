import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, LoaderCircle, Search, UsersRound } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import DataTableSkeleton from "@/components/common/DataTableSkeleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { getCustomer, getCustomers, updateCustomerStatus } from "@/services/customersService";

const customerStatuses = ["Active", "Inactive"];
const money = (amount) => `₹${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ customers: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailPage, setDetailPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCustomers({ page, limit: 10, search: debouncedSearch, status });
        if (active) setResult(data);
      } catch (loadError) {
        if (active) setError(loadError.message || "Unable to load customers.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [page, debouncedSearch, status, reloadKey]);

  useEffect(() => {
    if (!detailsOpen || !selectedCustomer?._id) return undefined;
    let active = true;
    const loadDetails = async () => {
      setDetailLoading(true);
      setDetailError("");
      try {
        const data = await getCustomer(selectedCustomer._id, { page: detailPage, limit: 5 });
        if (active) setDetail(data);
      } catch (loadError) {
        if (active) setDetailError(loadError.message || "Unable to load customer details.");
      } finally {
        if (active) setDetailLoading(false);
      }
    };
    loadDetails();
    return () => { active = false; };
  }, [detailsOpen, selectedCustomer?._id, detailPage]);

  const handleStatusChange = async (customer, nextStatus) => {
    if (customer.status === nextStatus) return;
    setUpdatingId(customer._id);
    try {
      const response = await updateCustomerStatus(customer._id, nextStatus);
      setResult((current) => ({
        ...current,
        customers: current.customers.map((item) => item._id === customer._id ? { ...item, status: response.user.status } : item),
      }));
      setSelectedCustomer((current) => current?._id === customer._id ? { ...current, status: response.user.status } : current);
      setReloadKey((value) => value + 1);
      setDetail((current) => current?.customer?._id === customer._id
        ? { ...current, customer: { ...current.customer, status: response.user.status } }
        : current);
      toast.success(`${customer.name} is now ${nextStatus.toLowerCase()}.`);
    } catch (updateError) {
      toast.error(updateError.message || "Unable to update customer status.");
    } finally {
      setUpdatingId("");
    }
  };

  const openDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetail(null);
    setDetailPage(1);
    setDetailsOpen(true);
  };
  const handleSearch = (event) => { setSearch(event.target.value); setPage(1); };
  const pagination = result.pagination;
  const firstItem = pagination.total ? (page - 1) * pagination.limit + 1 : 0;
  const lastItem = Math.min(page * pagination.limit, pagination.total);
  const history = detail?.pagination;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Customers" description="Explore customer accounts, order history, and account status." />
      <section className="rounded-xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search customers" placeholder="Search name or email" value={search} onChange={handleSearch} className="h-9 pl-9" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Status
            <select aria-label="Filter by customer status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="h-9 rounded-md border border-input bg-background px-3 text-foreground">
              <option value="">All statuses</option>
              {customerStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>

        {error ? (
          <div className="p-4"><ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)} /></div>
        ) : loading ? (
          <DataTableSkeleton columns={6} rows={6} />
        ) : (
          <>
            <div className="hidden md:block">
            <Table aria-label="Customers">
              <TableHeader><TableRow>
                <TableHead>Customer</TableHead><TableHead>Customer since</TableHead><TableHead>Orders</TableHead><TableHead>Total spent</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Details</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {result.customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"><UsersRound className="size-4" /></span><span><span className="block font-medium">{customer.name}</span><span className="text-xs text-muted-foreground">{customer.email}</span></span></div></TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>{customer.orderCount}</TableCell>
                    <TableCell>{money(customer.totalSpent)}</TableCell>
                    <TableCell>
                      <select aria-label={`Status for ${customer.name}`} value={customer.status} disabled={updatingId === customer._id} onChange={(event) => handleStatusChange(customer, event.target.value)} className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${customer.status === "Active" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {customerStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                    </TableCell>
                    <TableCell className="text-right"><Button aria-label={`View ${customer.name} details`} variant="ghost" size="icon-sm" onClick={() => openDetails(customer)}><Eye className="size-4" /></Button></TableCell>
                  </TableRow>
                ))}
                {result.customers.length === 0 && <TableRow><TableCell colSpan={6} className="p-0"><EmptyState title="No customers found" description={search || status ? "Try changing the search or status filter." : "Customer accounts will appear here when they register."} actionLabel={search || status ? "Clear filters" : undefined} onAction={search || status ? () => { setSearch(""); setStatus(""); setPage(1); } : undefined} /></TableCell></TableRow>}
              </TableBody>
            </Table>
            </div>
            <div className="space-y-3 p-3 md:hidden">
              {result.customers.map((customer) => (
                <article key={`mobile-${customer._id}`} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="truncate font-semibold">{customer.name}</p><p className="truncate text-sm text-muted-foreground">{customer.email}</p></div>
                    <select aria-label={`Status for ${customer.name}`} value={customer.status} disabled={updatingId === customer._id} onChange={(event) => handleStatusChange(customer, event.target.value)} className={`rounded-full border-0 px-2 py-1 text-xs font-medium ${customer.status === "Active" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      {customerStatuses.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm"><span><span className="block text-xs text-muted-foreground">Orders</span>{customer.orderCount}</span><span><span className="block text-xs text-muted-foreground">Total spent</span>{money(customer.totalSpent)}</span></div>
                  <div className="flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Since {formatDate(customer.createdAt)}</span><Button variant="outline" size="sm" onClick={() => openDetails(customer)}><Eye className="mr-2 size-4" />Details</Button></div>
                </article>
              ))}
              {result.customers.length === 0 && <div className="rounded-lg border"><EmptyState title="No customers found" description={search || status ? "Try changing the search or status filter." : "Customer accounts will appear here when they register."} actionLabel={search || status ? "Clear filters" : undefined} onAction={search || status ? () => { setSearch(""); setStatus(""); setPage(1); } : undefined} /></div>}
            </div>            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {firstItem}–{lastItem} of {pagination.total} customers</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="mr-1 size-4" />Previous</Button>
                <span className="min-w-20 text-center text-sm">Page {page} of {Math.max(1, pagination.totalPages)}</span>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight className="ml-1 size-4" /></Button>
              </div>
            </div>
          </>
        )}
      </section>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>Customer details</DialogTitle><DialogDescription>{detail?.customer?.name || selectedCustomer?.name || "Customer information"}</DialogDescription></DialogHeader>
          {detailLoading ? <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />Loading customer details...</div> : detailError ? <p role="alert" className="py-4 text-sm text-destructive">{detailError}</p> : detail && (
            <div className="space-y-5">
              <dl className="grid gap-x-5 gap-y-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
                <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{detail.customer.email}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{detail.customer.status}</dd></div>
                <div><dt className="text-muted-foreground">Customer since</dt><dd className="font-medium">{formatDate(detail.customer.createdAt)}</dd></div>
                <div><dt className="text-muted-foreground">Acquisition source</dt><dd className="font-medium">{detail.customer.source}</dd></div>
                <div><dt className="text-muted-foreground">Total orders</dt><dd className="font-medium">{detail.customer.orderCount}</dd></div>
                <div><dt className="text-muted-foreground">Total spent</dt><dd className="font-medium">{money(detail.customer.totalSpent)}</dd></div>
                <div><dt className="text-muted-foreground">Last order</dt><dd className="font-medium">{formatDate(detail.customer.lastOrderAt)}</dd></div>
              </dl>
              <div>
                <h3 className="mb-2 font-medium">Order history</h3>
                <Table aria-label="Customer order history">
                  <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {detail.orders.map((order) => <TableRow key={order._id}><TableCell className="font-medium">{order.orderId}</TableCell><TableCell>{formatDate(order.orderDate)}</TableCell><TableCell>{money(order.amount)}</TableCell><TableCell>{order.status}</TableCell></TableRow>)}
                    {detail.orders.length === 0 && <TableRow><TableCell colSpan={4} className="h-20 text-center text-muted-foreground">No orders yet.</TableCell></TableRow>}
                  </TableBody>
                </Table>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{history?.total ?? 0} total orders</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={!history || detailPage <= 1} onClick={() => setDetailPage((value) => value - 1)}><ChevronLeft className="size-4" />Previous</Button>
                    <span className="text-xs">{detailPage} / {Math.max(1, history?.totalPages ?? 0)}</span>
                    <Button variant="outline" size="sm" disabled={!history || detailPage >= history.totalPages} onClick={() => setDetailPage((value) => value + 1)}>Next<ChevronRight className="size-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;








