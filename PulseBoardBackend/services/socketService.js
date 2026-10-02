import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

let socketServer;

export const initializeSocketServer = (httpServer, allowedOrigins) => {
  socketServer = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  socketServer.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || !token.trim()) {
      return next(new Error("Authentication required"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const message = error.name === "TokenExpiredError"
        ? "Authentication token expired"
        : "Invalid authentication token";
      return next(new Error(message));
    }

    if (!decoded.id || !decoded.sid) {
      return next(new Error("Invalid authentication token"));
    }

    try {
      const user = await User.findById(decoded.id).select("sessions").lean();
      const session = user?.sessions?.find((item) => item.sid === decoded.sid);
      const expiresAt = session ? new Date(session.expiresAt).getTime() : NaN;
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        return next(new Error("Invalid or expired session"));
      }

      socket.user = {
        id: String(decoded.id),
        role: decoded.role,
        sid: String(decoded.sid),
      };
      return next();
    } catch {
      return next(new Error("Unable to validate socket session"));
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