import { logout } from "@/features/auth/authSlice";
import { store } from "@/store/store";

const API_BASE_URL = "http://localhost:3000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  let data;
  try {
    const responseData = await response.json();
    data = responseData && typeof responseData === "object" ? responseData : {};
  } catch {
    data = { message: response.statusText || "Unexpected server response" };
  }

  if (!response.ok) {
    const authenticationErrors = ["Authentication required", "Invalid or expired token"];
    if (response.status === 401 && authenticationErrors.includes(data.message)) {
      store.dispatch(logout());
    }
    const error = new Error(
      data.message || "Something went wrong"
    );

    error.status = response.status;

    throw error;
  }

  return data;
};