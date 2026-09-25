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

export const getSessions = async () => {
  return apiRequest("/auth/sessions", { method: "GET" });
};

export const revokeSession = async (sid) => {
  return apiRequest("/auth/sessions/" + encodeURIComponent(sid), { method: "DELETE" });
};

export const revokeOtherSessions = async () => {
  return apiRequest("/auth/sessions/others", { method: "DELETE" });
};

export const logoutCurrentSession = async () => {
  return apiRequest("/auth/logout", { method: "POST" });
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