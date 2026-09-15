import { apiRequest } from "@/services/api";

export const loginUser = (credentials) => {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = (userData) => {
  return apiRequest("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

const API_URL = "http://localhost:3000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch current user");
  }

  return data.user;
};
export const updateCurrentUser = async (userData) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data.user;
};

export const changePassword = async ({
  currentPassword,
  newPassword,
}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
};