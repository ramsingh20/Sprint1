import { apiRequest } from "@/services/api";

export const getUsers = async () => {
  const data = await apiRequest("/users", {
    method: "GET",
  });

  return data.users;
};

export const getUserById = async (id) => {
  const data = await apiRequest(`/users/${id}`, {
    method: "GET",
  });

  return data.user;
};

export const updateUser = async (id, userData) => {
  const data = await apiRequest(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  });

  return data.user;
};

export const deleteUser = async (id) => {
  return apiRequest(`/users/${id}`, {
    method: "DELETE",
  });
};

export const updateUserStatus = async (id, status) => {
  return apiRequest(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
};