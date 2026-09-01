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