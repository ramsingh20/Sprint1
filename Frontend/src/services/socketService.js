import { io } from "socket.io-client";

const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const apiUrl = new URL(configuredApiUrl, window.location.origin);
apiUrl.pathname = apiUrl.pathname.replace(/\/api\/?$/, "") || "/";

export const socket = io(apiUrl.origin, {
  autoConnect: false,
  reconnection: true,
  auth: (callback) => {
    const token = localStorage.getItem("token");
    callback(token ? { token } : {});
  },
});

export const connectSocket = () => {
  if (!localStorage.getItem("token")) {
    socket.disconnect();
    return socket;
  }
  if (!socket.connected) socket.connect();
  return socket;
};

export const disconnectSocket = () => socket.disconnect();