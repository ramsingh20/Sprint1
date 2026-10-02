import mongoose from "mongoose";
import Order from "../models/order.js";
import User from "../models/user.js";

const allowedStatuses = ["Completed", "Pending", "Failed"];
const orderLookup = (id) => mongoose.isValidObjectId(id)
  ? { $or: [{ _id: id }, { orderId: id }] }
  : { orderId: id };

const allowedCreateFields = ["orderId", "customer", "amount", "status", "orderDate"];

export const createOrder = async (req, res) => {
  const body = req.body ?? {};
  const fields = Object.keys(body);
  if (fields.some((field) => !allowedCreateFields.includes(field))) {
    return res.status(400).json({ message: "Order contains unsupported fields" });
  }
  if (typeof body.orderId !== "string" || !body.orderId.trim() || body.orderId.trim().length > 50) {
    return res.status(400).json({ message: "A valid order ID is required (maximum 50 characters)" });
  }
  if (typeof body.customer !== "string" || !mongoose.isValidObjectId(body.customer)) {
    return res.status(400).json({ message: "A valid customer ID is required" });
  }
  if (typeof body.amount !== "number" || !Number.isFinite(body.amount) || body.amount < 0) {
    return res.status(400).json({ message: "Order amount must be a non-negative number" });
  }
  if (body.status !== undefined && !allowedStatuses.includes(body.status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }
  if (body.orderDate !== undefined && (typeof body.orderDate !== "string" || !Number.isFinite(Date.parse(body.orderDate)))) {
    return res.status(400).json({ message: "Invalid order date" });
  }

  try {
    const customer = await User.findById(body.customer).select("_id");
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const order = new Order({
      orderId: body.orderId.trim(),
      customer: customer._id,
      amount: body.amount,
      ...(body.status !== undefined && { status: body.status }),
      ...(body.orderDate !== undefined && { orderDate: new Date(body.orderDate) }),
    });
    await order.save();
    await order.populate("customer", "name email");

    req.app.get("io").emit("order:created", order.toObject());
    return res.status(201).json({ order });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Order ID already exists" });
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid order data" });
    }
    console.error("Create order error:", error.message);
    return res.status(500).json({ message: "Unable to create order" });
  }
};
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
    req.app.get("io").emit("order:status-updated", order.toObject());
    return res.json({ order });
  } catch (error) {
    console.error("Update order status error:", error.message);
    return res.status(500).json({ message: "Unable to update order status" });
  }
};

