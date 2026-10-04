import express from "express";
import { getAnalyticsRevenue, getAnalyticsStats, getTrafficSources, getUserAcquisition, } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("Admin", "Manager"));

router.get("/stats", getAnalyticsStats);
router.get("/revenue", getAnalyticsRevenue);
router.get("/user-acquisition", getUserAcquisition);
router.get("/traffic-sources", getTrafficSources);

export default router;