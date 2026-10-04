import express from "express";
import { getReportRevenue, getReportStats, getReportTable } from "../controllers/reportsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("Admin", "Manager"));

router.get("/stats", getReportStats);
router.get("/revenue", getReportRevenue);
router.get("/table", getReportTable);

export default router;