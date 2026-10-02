import { Server } from "socket.io";

let socketServer;

export const initializeSocketServer = (httpServer, allowedOrigins) => {
  socketServer = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
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