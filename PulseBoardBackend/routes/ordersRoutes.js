import express from "express";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/ordersController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect, authorize("Admin", "Manager"));
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

export default router;
