import User from "../models/user.js";
import { disconnectUserSockets } from "../services/socketService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Find existing user
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      existingUser.name = name.trim();
    }

    // Update email
    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check whether another user already has this email
      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      existingUser.email = normalizedEmail;
    }

    let roleChanged = false;

    // Only Admin can change roles
    if (role !== undefined) {
      if (req.user.role !== "Admin") {
        return res.status(403).json({
          message: "Only Admin can change user roles",
        });
      }

      const allowedRoles = ["Admin", "Manager", "User"];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      roleChanged = existingUser.role !== role;
      existingUser.role = role;
    }

    if (roleChanged) existingUser.sessions = [];
    const updatedUser = await existingUser.save();
    if (roleChanged) disconnectUserSockets(updatedUser._id);

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Failed to update user",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["Active", "Inactive"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update status
    user.status = status;
    if (status === "Inactive") user.sessions = [];

    const updatedUser = await user.save();
    if (status === "Inactive") disconnectUserSockets(updatedUser._id);

    return res.status(200).json({
      message: `User ${status.toLowerCase()} successfully`,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      message: "Failed to update user status",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent Admin from deleting their own account
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Failed to delete user",
    });
  }
};