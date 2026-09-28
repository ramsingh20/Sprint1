import mongoose from "mongoose";
import Order from "../models/order.js";
import User from "../models/user.js";
import { updateUserStatus } from "./userController.js";

const customerStatuses = ["Active", "Inactive"];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const validPageParams = (page, limit) => Number.isInteger(page) && page > 0 && Number.isInteger(limit) && limit > 0 && limit <= 100;

export const getCustomers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status : "";
    if (!validPageParams(page, limit)) return res.status(400).json({ message: "Page must be positive and limit must be between 1 and 100" });
    if (search.length > 100) return res.status(400).json({ message: "Search must be 100 characters or fewer" });
    if (status && !customerStatuses.includes(status)) return res.status(400).json({ message: "Invalid customer status" });

    const filter = { role: "User" };
    if (status) filter.status = status;
    if (search) {
      const expression = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: expression }, { email: expression }];
    }

    const [customers, total] = await Promise.all([
      User.find(filter).select("name email status source createdAt").sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    const ids = customers.map((customer) => customer._id);
    const orderStats = ids.length ? await Order.aggregate([
      { $match: { customer: { $in: ids } } },
      { $group: { _id: "$customer", orderCount: { $sum: 1 }, totalSpent: { $sum: "$amount" }, lastOrderAt: { $max: "$orderDate" } } },
    ]) : [];
    const statsByCustomer = new Map(orderStats.map((stats) => [String(stats._id), stats]));
    const items = customers.map((customer) => {
      const stats = statsByCustomer.get(String(customer._id));
      return { ...customer, orderCount: stats?.orderCount ?? 0, totalSpent: stats?.totalSpent ?? 0, lastOrderAt: stats?.lastOrderAt ?? null };
    });
    return res.json({ customers: items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("Get customers error:", error.message);
    return res.status(500).json({ message: "Unable to load customers" });
  }
};

export const getCustomerById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid customer ID" });
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    if (!validPageParams(page, limit)) return res.status(400).json({ message: "Page must be positive and limit must be between 1 and 100" });

    const customer = await User.findOne({ _id: req.params.id, role: "User" })
      .select("name email status source createdAt").lean();
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const [orders, totalOrders, totals] = await Promise.all([
      Order.find({ customer: customer._id }).select("orderId amount status orderDate")
        .sort({ orderDate: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments({ customer: customer._id }),
      Order.aggregate([
        { $match: { customer: customer._id } },
        { $group: { _id: null, totalSpent: { $sum: "$amount" }, lastOrderAt: { $max: "$orderDate" } } },
      ]),
    ]);
    return res.json({
      customer: { ...customer, orderCount: totalOrders, totalSpent: totals[0]?.totalSpent ?? 0, lastOrderAt: totals[0]?.lastOrderAt ?? null },
      orders,
      pagination: { page, limit, total: totalOrders, totalPages: Math.ceil(totalOrders / limit) },
    });
  } catch (error) {
    console.error("Get customer error:", error.message);
    return res.status(500).json({ message: "Unable to load customer" });
  }
};

export const updateCustomerStatus = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid customer ID" });
  if (Object.keys(req.body ?? {}).length !== 1 || !customerStatuses.includes(req.body?.status)) {
    return res.status(400).json({ message: "Provide a valid customer status" });
  }
  try {
    const customerExists = await User.exists({ _id: req.params.id, role: "User" });
    if (!customerExists) return res.status(404).json({ message: "Customer not found" });
    return updateUserStatus(req, res);
  } catch (error) {
    console.error("Update customer status error:", error.message);
    return res.status(500).json({ message: "Unable to update customer status" });
  }
};
