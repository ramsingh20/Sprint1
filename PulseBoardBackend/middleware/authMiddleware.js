import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (!decoded.id || !decoded.sid) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findOne({ _id: decoded.id, "sessions.sid": decoded.sid })
      .select("role status sessions")
      .lean();
    if (!user || user.status === "Inactive" || user.role !== decoded.role) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    const session = user.sessions?.find((item) => item.sid === decoded.sid);
    if (!session) return res.status(401).json({ message: "Invalid or expired token" });

    const lastActiveAt = new Date(session.lastActiveAt).getTime();
    if (!Number.isFinite(lastActiveAt) || Date.now() - lastActiveAt >= 5 * 60 * 1000) {
      await User.updateOne(
        { _id: decoded.id, "sessions.sid": decoded.sid },
        { $set: { "sessions.$.lastActiveAt": new Date() } }
      );
    }

    req.user = decoded;
    return next();
  } catch (error) {
    console.error("Session validation error:", error.message);
    return res.status(500).json({ message: "Unable to validate session" });
  }
};