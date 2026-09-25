import { apiRequest } from "@/services/api";

export const getCustomers = ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return apiRequest(`/customers?${params.toString()}`, { method: "GET" });
};

export const getCustomer = (id, { page = 1, limit = 5 } = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiRequest(`/customers/${encodeURIComponent(id)}?${params.toString()}`, { method: "GET" });
};

export const updateCustomerStatus = (id, status) => apiRequest(
  `/customers/${encodeURIComponent(id)}/status`,
  { method: "PATCH", body: JSON.stringify({ status }) }
);
