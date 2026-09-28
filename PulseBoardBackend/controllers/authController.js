import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createSessionToken = async (user, req) => {
  const sid = randomUUID();
  const now = new Date();
  const token = jwt.sign({ id: user._id, role: user.role, sid }, process.env.JWT_SECRET, { expiresIn: "30m" });
  user.sessions = user.sessions.filter((session) => new Date(session.expiresAt) > now);
  user.sessions.push({
    sid,
    userAgent: String(req.get("user-agent") ?? "").slice(0, 300),
    createdAt: now,
    lastActiveAt: now,
    expiresAt: new Date(now.getTime() + 30 * 60 * 1000),
  });
  if (user.sessions.length > 10) user.sessions.splice(0, user.sessions.length - 10);
  await user.save();
  return token;
};

const getNotificationPreferences = (user) => {
  const notifications = user.preferences?.notifications ?? {};
  return {
    orderUpdates: notifications.orderUpdates ?? true,
    customerActivity: notifications.customerActivity ?? true,
    weeklyReports: notifications.weeklyReports ?? false,
    securityAlerts: notifications.securityAlerts ?? true,
    loginAlerts: notifications.loginAlerts ?? true,
  };
};

export const authRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (normalizedName.length < 1 || !isValidEmail(normalizedEmail) || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "Enter a valid name and email, and a password with at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();
    const token = await createSessionToken(newUser, req);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

export const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!isValidEmail(normalizedEmail) || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "A valid email and password are required",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (existingUser.status === "Inactive") {
      return res.status(403).json({
        message: "Your account is inactive. Please contact an administrator.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = await createSessionToken(existingUser, req);

    return res.status(200).json({
      message: "Login successful",
      Ruser: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        status: existingUser.status,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Current user fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        generalSettings: user.generalSettings,
        notificationPreferences: getNotificationPreferences(user),
        appearancePreference: user.preferences?.appearance?.theme ?? "system",
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Failed to fetch current user",
    });
  }
};
export const updateCurrentUser = async (req, res) => {
  try {
    if (req.body.appearancePreference !== undefined) {
      const allowedThemes = ["light", "dark", "system"];
      const { appearancePreference } = req.body;
      if (!allowedThemes.includes(appearancePreference)) {
        return res.status(400).json({ message: "Invalid appearance preference" });
      }
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.preferences.appearance.theme = appearancePreference;
      await user.save();
      return res.status(200).json({
        message: "Appearance preference updated successfully",
        user: {
          id: user._id, name: user.name, email: user.email, role: user.role, status: user.status,
          createdAt: user.createdAt, updatedAt: user.updatedAt,
          appearancePreference: user.preferences.appearance.theme,
        },
      });
    }

    if (req.body.notificationPreferences !== undefined) {
      const notificationPreferences = req.body.notificationPreferences;
      const allowedKeys = ["orderUpdates", "customerActivity", "weeklyReports", "securityAlerts", "loginAlerts"];
      if (!notificationPreferences || typeof notificationPreferences !== "object" || Array.isArray(notificationPreferences)) {
        return res.status(400).json({ message: "Notification preferences must be an object" });
      }
      const keys = Object.keys(notificationPreferences);
      if (keys.length !== allowedKeys.length || !allowedKeys.every((key) => keys.includes(key)) ||
          !allowedKeys.every((key) => typeof notificationPreferences[key] === "boolean")) {
        return res.status(400).json({ message: "Invalid notification preferences" });
      }
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      Object.assign(user.preferences.notifications, notificationPreferences);
      await user.save();
      return res.status(200).json({
        message: "Notification preferences updated successfully",
        user: {
          id: user._id, name: user.name, email: user.email, role: user.role, status: user.status,
          createdAt: user.createdAt, updatedAt: user.updatedAt,
          notificationPreferences: getNotificationPreferences(user),
        },
      });
    }

    if (req.body.generalSettings !== undefined) {
      const { workspaceName, description, language, timezone } = req.body.generalSettings ?? {};
      const allowedLanguages = ["en", "hi"];
      const allowedTimezones = ["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"];
      if (typeof workspaceName !== "string" || workspaceName.trim().length < 2 || workspaceName.trim().length > 50) {
        return res.status(400).json({ message: "Workspace name must be between 2 and 50 characters" });
      }
      if (typeof description !== "string" || description.trim().length > 200) {
        return res.status(400).json({ message: "Description must not exceed 200 characters" });
      }
      if (!allowedLanguages.includes(language) || !allowedTimezones.includes(timezone)) {
        return res.status(400).json({ message: "Invalid language or timezone" });
      }
      const settingsUser = await User.findById(req.user.id);
      if (!settingsUser) return res.status(404).json({ message: "User not found" });
      settingsUser.generalSettings = { workspaceName: workspaceName.trim(), description: description.trim(), language, timezone };
      await settingsUser.save();
      return res.status(200).json({ message: "General settings updated successfully", user: {
        id: settingsUser._id, name: settingsUser.name, email: settingsUser.email, role: settingsUser.role,
        status: settingsUser.status, createdAt: settingsUser.createdAt, updatedAt: settingsUser.updatedAt,
        generalSettings: settingsUser.generalSettings,
      } });
    }

    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name.trim();
    user.email = normalizedEmail;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        generalSettings: user.generalSettings,
      },
    });
  } catch (error) {
    console.error("Update current user error:", error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

export const getSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("sessions").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    const now = Date.now();
    const sessions = (user.sessions ?? [])
      .filter((session) => new Date(session.expiresAt).getTime() > now)
      .slice()
      .sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt))
      .map(({ sid, userAgent, createdAt, lastActiveAt }) => ({
        id: sid,
        userAgent,
        createdAt,
        lastActiveAt,
        current: sid === req.user.sid,
      }));
    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("Get sessions error:", error);
    return res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

export const revokeSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const sessionExists = user.sessions.some((session) => session.sid === req.params.sid);
    if (!sessionExists) return res.status(404).json({ message: "Session not found" });
    user.sessions = user.sessions.filter((session) => session.sid !== req.params.sid);
    await user.save();
    return res.status(200).json({ message: "Session signed out successfully" });
  } catch (error) {
    console.error("Revoke session error:", error);
    return res.status(500).json({ message: "Failed to sign out session" });
  }
};

export const revokeOtherSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.sessions = user.sessions.filter((session) => session.sid === req.user.sid);
    await user.save();
    return res.status(200).json({ message: "Other sessions signed out successfully" });
  } catch (error) {
    console.error("Revoke other sessions error:", error);
    return res.status(500).json({ message: "Failed to sign out other sessions" });
  }
};

export const logoutCurrentSession = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user.id }, { $pull: { sessions: { sid: req.user.sid } } });
    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Failed to sign out" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body ?? {};

    // 1. Validate required fields
    if (typeof currentPassword !== "string" || !currentPassword || typeof newPassword !== "string" || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // 2. Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    // 3. Find current user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 4. Verify current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // 5. Prevent same password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // 6. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 7. Save new password and revoke other active sessions
    user.password = hashedPassword;
    user.sessions = user.sessions.filter((session) => session.sid === req.user.sid);

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};