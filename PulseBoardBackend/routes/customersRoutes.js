import express from "express";
import { getCustomerById, getCustomers, updateCustomerStatus } from "../controllers/customersController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect, authorize("Admin", "Manager"));
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.patch("/:id/status", updateCustomerStatus);

export default router;
