const API_URL = "http://localhost:3000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getUsers = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data.users;
};

export const getUserById = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data.user;
};