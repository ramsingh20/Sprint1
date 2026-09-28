import express from "express";
import { getAnalyticsRevenue, getAnalyticsStats, getTrafficSources, getUserAcquisition, } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getAnalyticsStats);
router.get("/revenue", protect, getAnalyticsRevenue);
router.get("/user-acquisition", protect, getUserAcquisition);
router.get("/traffic-sources", protect, getTrafficSources);

export default router;