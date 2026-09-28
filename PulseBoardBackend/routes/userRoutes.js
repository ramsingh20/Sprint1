import e from "express";
import { deleteUser, getUserById, getUsers, updateUser, updateUserStatus } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = e.Router();

router.get("/", protect, authorize("Admin", "Manager"), getUsers);
router.get("/:id", protect, authorize("Admin", "Manager"),getUserById);
router.patch("/:id", protect, authorize("Admin", "Manager"), updateUser);

router.patch("/:id/status", protect, authorize("Admin", "Manager"),updateUserStatus);

router.delete("/:id", protect, authorize("Admin"), deleteUser);

export default router;