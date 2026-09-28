import { apiRequest } from "@/services/api";

export const getOrders = ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return apiRequest(`/orders?${params.toString()}`, { method: "GET" });
};

export const getOrder = (id) => apiRequest(`/orders/${encodeURIComponent(id)}`, { method: "GET" });

export const updateOrderStatus = (id, status) => apiRequest(
  `/orders/${encodeURIComponent(id)}/status`,
  { method: "PATCH", body: JSON.stringify({ status }) }
);
