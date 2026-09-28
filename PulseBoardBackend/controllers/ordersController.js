import mongoose from "mongoose";
import Order from "../models/order.js";
import User from "../models/user.js";

const allowedStatuses = ["Completed", "Pending", "Failed"];
const orderLookup = (id) => mongoose.isValidObjectId(id)
  ? { $or: [{ _id: id }, { orderId: id }] }
  : { orderId: id };

export const getOrders = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status : "";
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ message: "Page must be positive and limit must be between 1 and 100" });
    }
    if (status && !allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid order status" });
    if (search.length > 100) return res.status(400).json({ message: "Search must be 100 characters or fewer" });

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matchingCustomers = await User.find({
        $or: [
          { name: { $regex: escapedSearch, $options: "i" } },
          { email: { $regex: escapedSearch, $options: "i" } },
        ],
      }).distinct("_id");
      filter.$or = [
        { orderId: { $regex: escapedSearch, $options: "i" } },
        { customer: { $in: matchingCustomers } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).populate("customer", "name email")
        .sort({ orderDate: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    return res.json({ orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("Get orders error:", error.message);
    return res.status(500).json({ message: "Unable to load orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne(orderLookup(req.params.id)).populate("customer", "name email").lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ order });
  } catch (error) {
    console.error("Get order error:", error.message);
    return res.status(500).json({ message: "Unable to load order" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const body = req.body ?? {};
  if (Object.keys(body).length !== 1 || !allowedStatuses.includes(body.status)) {
    return res.status(400).json({ message: "Provide a valid order status" });
  }
  try {
    const order = await Order.findOneAndUpdate(orderLookup(req.params.id), { $set: { status: body.status } }, {
      returnDocument: "after", runValidators: true,
    }).populate("customer", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ order });
  } catch (error) {
    console.error("Update order status error:", error.message);
    return res.status(500).json({ message: "Unable to update order status" });
  }
};

