import express from "express";
import { getDashboardStats, getRecentActivity, getRevenueData, getUserGrowthData } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/revenue", protect, getRevenueData);
router.get("/user-growth", protect, getUserGrowthData);
router.get("/activity", protect, getRecentActivity);

export default router;