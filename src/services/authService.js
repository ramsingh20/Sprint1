import { apiRequest } from "@/services/api";

export const loginUser = async (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async () => {
  return apiRequest("/auth/me", {
    method: "GET",
  });
};

export const updateCurrentUser = async (userData) => {
  return apiRequest("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
};

export const changePassword = async ({
  currentPassword,
  newPassword,
}) => {
  return apiRequest("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
};