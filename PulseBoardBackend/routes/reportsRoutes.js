import express from "express";
import { getReportRevenue, getReportStats, getReportTable } from "../controllers/reportsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getReportStats);
router.get("/revenue", protect, getReportRevenue);
router.get("/table", protect, getReportTable);

export default router;