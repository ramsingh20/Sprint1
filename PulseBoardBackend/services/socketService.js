import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let socketServer;

export const initializeSocketServer = (httpServer, allowedOrigins) => {
  socketServer = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  socketServer.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || !token.trim()) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.id || !decoded.sid) {
        return next(new Error("Invalid authentication token"));
      }

      socket.user = {
        id: String(decoded.id),
        role: decoded.role,
        sid: String(decoded.sid),
      };
      return next();
    } catch (error) {
      const message = error.name === "TokenExpiredError"
        ? "Authentication token expired"
        : "Invalid authentication token";
      return next(new Error(message));
    }
  });

  socketServer.on("connection", (socket) => {
    console.info(`Socket.IO client connected: ${socket.id}`);
    socket.on("disconnect", (reason) => {
      console.info(`Socket.IO client disconnected: ${socket.id} (${reason})`);
    });
  });

  return socketServer;
};

export const getSocketServer = () => {
  if (!socketServer) {
    throw new Error("Socket.IO server has not been initialized");
  }
  return socketServer;
};