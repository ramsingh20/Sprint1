import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
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
import { getOrder, getOrders, updateOrderStatus } from "@/services/ordersService";

const statusOptions = ["Pending", "Completed", "Failed"];
const money = (amount) => `$${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (date) => new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const statusClass = {
  Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Failed: "bg-destructive/10 text-destructive",
};

const Orders = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ orders: [], pagination: { total: 0, totalPages: 0, page: 1 } });
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
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
        const data = await getOrders({ page, limit: 10, search: debouncedSearch, status });
        if (active) setResult(data);
      } catch (loadError) {
        if (active) setError(loadError.message || "Unable to load orders.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [page, debouncedSearch, status, reloadKey]);

  const handleSearch = (event) => { setSearch(event.target.value); setPage(1); };
  const handleStatusFilter = (event) => { setStatus(event.target.value); setPage(1); };

  const handleStatusChange = async (order, nextStatus) => {
    if (nextStatus === order.status) return;
    setUpdatingId(order._id);
    try {
      const data = await updateOrderStatus(order._id, nextStatus);
      setResult((current) => ({ ...current, orders: current.orders.map((item) => item._id === order._id ? data.order : item) }));
      if (selectedOrder?._id === order._id) setSelectedOrder(data.order);
      setReloadKey((current) => current + 1);
      toast.success(`Order ${order.orderId} updated to ${nextStatus}.`);
    } catch (updateError) {
      toast.error(updateError.message || "Unable to update order status.");
    } finally {
      setUpdatingId("");
    }
  };

  const openDetails = async (order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    setDetailError("");
    try {
      const data = await getOrder(order._id);
      setSelectedOrder(data.order);
    } catch (detailLoadError) {
      setDetailError(detailLoadError.message || "Unable to load order details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const pagination = result.pagination;
  const firstItem = pagination.total ? (page - 1) * pagination.limit + 1 : 0;
  const lastItem = Math.min(page * pagination.limit, pagination.total);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Orders" description="Review orders, search customers, and keep order statuses up to date." />
      <section className="rounded-xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search orders" placeholder="Search order ID or customer" value={search} onChange={handleSearch} className="h-9 pl-9" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Status
            <select aria-label="Filter by status" value={status} onChange={handleStatusFilter} className="h-9 rounded-md border border-input bg-background px-3 text-foreground">
              <option value="">All statuses</option>
              {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>

        {error ? (
          <div className="p-4"><ErrorState message={error} onRetry={() => setReloadKey((current) => current + 1)} /></div>
        ) : loading ? (
          <DataTableSkeleton columns={6} rows={6} />
        ) : (
          <>
            <div className="hidden md:block">
            <Table aria-label="Orders">
              <TableHeader><TableRow>
                <TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Details</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {result.orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell><div>{order.customer?.name || "Unknown customer"}</div><div className="text-xs text-muted-foreground">{order.customer?.email || ""}</div></TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{money(order.amount)}</TableCell>
                    <TableCell>
                      <select aria-label={`Status for ${order.orderId}`} value={order.status} disabled={updatingId === order._id} onChange={(event) => handleStatusChange(order, event.target.value)} className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${statusClass[order.status] || "bg-muted text-muted-foreground"}`}>
                        {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </TableCell>
                    <TableCell className="text-right"><Button aria-label={`View ${order.orderId} details`} variant="ghost" size="icon-sm" onClick={() => openDetails(order)}><Eye className="size-4" /></Button></TableCell>
                  </TableRow>
                ))}
                {result.orders.length === 0 && <TableRow><TableCell colSpan={6} className="p-0"><EmptyState title="No orders found" description={search || status ? "Try changing the search or status filter." : "Orders will appear here when they are created."} actionLabel={search || status ? "Clear filters" : undefined} onAction={search || status ? () => { setSearch(""); setStatus(""); setPage(1); } : undefined} /></TableCell></TableRow>}
              </TableBody>
            </Table>
            </div>
            <div className="space-y-3 p-3 md:hidden">
              {result.orders.map((order) => (
                <article key={`mobile-${order._id}`} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="font-semibold">{order.orderId}</p><p className="truncate text-sm text-muted-foreground">{order.customer?.name || "Unknown customer"}</p></div>
                    <select aria-label={`Status for ${order.orderId}`} value={order.status} disabled={updatingId === order._id} onChange={(event) => handleStatusChange(order, event.target.value)} className={`max-w-32 rounded-full border-0 px-2 py-1 text-xs font-medium ${statusClass[order.status] || "bg-muted text-muted-foreground"}`}>
                      {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">{formatDate(order.orderDate)}</span><span className="font-medium">{money(order.amount)}</span></div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openDetails(order)}><Eye className="mr-2 size-4" />View details</Button>
                </article>
              ))}
              {result.orders.length === 0 && <div className="rounded-lg border"><EmptyState title="No orders found" description={search || status ? "Try changing the search or status filter." : "Orders will appear here when they are created."} actionLabel={search || status ? "Clear filters" : undefined} onAction={search || status ? () => { setSearch(""); setStatus(""); setPage(1); } : undefined} /></div>}
            </div>            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {firstItem}–{lastItem} of {pagination.total} orders</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="mr-1 size-4" />Previous</Button>
                <span className="min-w-20 text-center text-sm">Page {page} of {Math.max(1, pagination.totalPages)}</span>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)}>Next<ChevronRight className="ml-1 size-4" /></Button>
              </div>
            </div>
          </>
        )}
      </section>

      <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
            <DialogDescription>{selectedOrder?.orderId || "Order information"}</DialogDescription>
          </DialogHeader>
          {detailLoading ? <p className="py-4 text-sm text-muted-foreground">Loading order details...</p> : detailError ? <p role="alert" className="py-4 text-sm text-destructive">{detailError}</p> : selectedOrder && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Customer</dt><dd>{selectedOrder.customer?.name || "Unknown customer"}</dd>
              <dt className="text-muted-foreground">Email</dt><dd>{selectedOrder.customer?.email || "—"}</dd>
              <dt className="text-muted-foreground">Order date</dt><dd>{formatDate(selectedOrder.orderDate)}</dd>
              <dt className="text-muted-foreground">Amount</dt><dd>{money(selectedOrder.amount)}</dd>
              <dt className="text-muted-foreground">Status</dt><dd>{selectedOrder.status}</dd>
              <dt className="text-muted-foreground">Created</dt><dd>{formatDate(selectedOrder.createdAt)}</dd>
              <dt className="text-muted-foreground">Last updated</dt><dd>{formatDate(selectedOrder.updatedAt)}</dd>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;










