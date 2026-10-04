import e from "express";
import {
  authLogin,
  authRegister,
  changePassword,
  getCurrentUser,
  getSessions,
  logoutCurrentSession,
  revokeOtherSessions,
  revokeSession,
  updateCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = e.Router();

router.post('/register', authRegister)
router.post('/login', authLogin)
router.get("/me", protect, getCurrentUser);
router.patch("/me", protect, updateCurrentUser);
router.patch("/change-password", protect, changePassword);
router.get("/sessions", protect, getSessions);
router.delete("/sessions/others", protect, revokeOtherSessions);
router.delete("/sessions/:sid", protect, revokeSession);
router.post("/logout", protect, logoutCurrentSession);

export default router