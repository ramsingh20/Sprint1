import e from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import customersRoutes from "./routes/customersRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const requiredEnvironment = ["MONGO_URI", "JWT_SECRET"];
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]?.trim());
if (missingEnvironment.length) throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid TCP port number");
const allowedOrigins = (process.env.CORS_ORIGINS || (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173"))
  .split(",").map((origin) => origin.trim()).filter(Boolean);
if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
  throw new Error("CORS_ORIGINS must contain at least one frontend origin in production");
}

const app = e();
app.disable("x-powered-by");
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(null, false);
} }));
app.use(e.json({ limit: "1mb" }));
app.get("/api/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  return res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? "ok" : "unavailable" });
});

app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/customers", customersRoutes);

const startServer = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(port, () => console.log(`PulseBoard API listening on port ${port}`));
};
startServer().catch((error) => {
  console.error("Unable to start PulseBoard API:", error.message);
  process.exitCode = 1;
});