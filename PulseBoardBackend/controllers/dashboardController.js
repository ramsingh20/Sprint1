import Order from "../models/order.js";
import User from "../models/user.js";

const allowedPeriods = [7, 30, 90, 365];
const dayMs = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
};

const getDashboardRanges = (req) => {
  const { startDate: startValue, endDate: endValue } = req.query;
  if (startValue !== undefined || endValue !== undefined) {
    const startDate = parseDate(startValue);
    const lastDay = parseDate(endValue);
    if (!startDate || !lastDay || lastDay < startDate) return { error: "Provide a valid startDate and endDate with startDate on or before endDate" };
    const endDate = new Date(lastDay.getTime() + dayMs);
    const duration = Math.round((endDate - startDate) / dayMs);
    if (duration > 366) return { error: "Custom dashboard ranges may not exceed 366 days" };
    return {
      current: { startDate, endDate },
      previous: { startDate: new Date(startDate.getTime() - duration * dayMs), endDate: startDate },
      period: duration,
    };
  }

  const period = Number(req.query.period ?? 30);
  if (!allowedPeriods.includes(period)) return { error: "Period must be 7, 30, 90, or 365 days" };
  const today = new Date();
  const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
  const startDate = new Date(endDate.getTime() - period * dayMs);
  return {
    current: { startDate, endDate },
    previous: { startDate: new Date(startDate.getTime() - period * dayMs), endDate: startDate },
    period,
  };
};

const countAndRevenue = async ({ startDate, endDate }) => {
  const orderFilter = { orderDate: { $gte: startDate, $lt: endDate } };
  const [totalOrders, completedOrders, revenue, newCustomers] = await Promise.all([
    Order.countDocuments(orderFilter),
    Order.countDocuments({ ...orderFilter, status: "Completed" }),
    Order.aggregate([
      { $match: { ...orderFilter, status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    User.countDocuments({ role: "User", createdAt: { $gte: startDate, $lt: endDate } }),
  ]);
  return {
    totalOrders,
    completedOrders,
    totalRevenue: revenue[0]?.total ?? 0,
    newCustomers,
    orderCompletionRate: totalOrders ? Number(((completedOrders / totalOrders) * 100).toFixed(1)) : 0,
  };
};

const percentChange = (current, previous) => previous === 0
  ? (current === 0 ? 0 : null)
  : Number((((current - previous) / previous) * 100).toFixed(1));

const getBucketInfo = (period) => period > 90
  ? { format: "%Y-%m", unit: "month" }
  : { format: "%Y-%m-%d", unit: "day" };

const getBucketRanges = ({ startDate, endDate }, unit) => {
  const buckets = [];
  if (unit === "month") {
    const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1));
    while (cursor < endDate) {
      const next = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
      buckets.push({ key: cursor.toISOString().slice(0, 7), date: new Date(cursor) });
      cursor.setTime(next.getTime());
    }
  } else {
    const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    while (cursor < endDate) {
      buckets.push({ key: cursor.toISOString().slice(0, 10), date: new Date(cursor) });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }
  return buckets;
};

const formatBucketLabel = (date, unit) => unit === "month"
  ? new Intl.DateTimeFormat("en", { month: "short", year: "2-digit", timeZone: "UTC" }).format(date)
  : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);

const aggregateTrend = async ({ model, match, dateField, valueName, range, bucketInfo }) => {
  const values = await model.aggregate([
    { $match: { ...match, [dateField]: { $gte: range.startDate, $lt: range.endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: bucketInfo.format, date: `$${dateField}`, timezone: "UTC" } },
        value: { $sum: 1 },
      },
    },
  ]);
  const valueMap = new Map(values.map((item) => [item._id, item.value]));
  return getBucketRanges(range, bucketInfo.unit).map(({ key, date }) => ({
    month: formatBucketLabel(date, bucketInfo.unit),
    [valueName]: valueMap.get(key) ?? 0,
  }));
};

export const getDashboardStats = async (req, res) => {
  const ranges = getDashboardRanges(req);
  if (ranges.error) return res.status(400).json({ message: ranges.error });
  try {
    const [current, previous] = await Promise.all([
      countAndRevenue(ranges.current),
      countAndRevenue(ranges.previous),
    ]);
    return res.status(200).json({
      message: "Dashboard statistics fetched successfully",
      stats: {
        totalRevenue: current.totalRevenue,
        newCustomers: current.newCustomers,
        totalOrders: current.totalOrders,
        orderCompletionRate: current.orderCompletionRate,
        changes: {
          totalRevenue: percentChange(current.totalRevenue, previous.totalRevenue),
          newCustomers: percentChange(current.newCustomers, previous.newCustomers),
          totalOrders: percentChange(current.totalOrders, previous.totalOrders),
          orderCompletionRate: Number((current.orderCompletionRate - previous.orderCompletionRate).toFixed(1)),
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    return res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};

export const getRevenueData = async (req, res) => {
  const ranges = getDashboardRanges(req);
  if (ranges.error) return res.status(400).json({ message: ranges.error });
  try {
    const bucketInfo = getBucketInfo(ranges.period);
    const revenueRows = await Order.aggregate([
      { $match: { status: "Completed", orderDate: { $gte: ranges.current.startDate, $lt: ranges.current.endDate } } },
      { $group: {
        _id: { $dateToString: { format: bucketInfo.format, date: "$orderDate", timezone: "UTC" } },
        revenue: { $sum: "$amount" },
      } },
    ]);
    const revenueMap = new Map(revenueRows.map((item) => [item._id, item.revenue]));
    const revenue = getBucketRanges(ranges.current, bucketInfo.unit).map(({ key, date }) => ({
      month: formatBucketLabel(date, bucketInfo.unit),
      revenue: revenueMap.get(key) ?? 0,
    }));
    return res.status(200).json({ message: "Revenue data fetched successfully", revenue });
  } catch (error) {
    console.error("Revenue data error:", error.message);
    return res.status(500).json({ message: "Failed to fetch revenue data" });
  }
};

export const getUserGrowthData = async (req, res) => {
  const ranges = getDashboardRanges(req);
  if (ranges.error) return res.status(400).json({ message: ranges.error });
  try {
    const bucketInfo = getBucketInfo(ranges.period);
    const userGrowth = await aggregateTrend({
      model: User,
      match: { role: "User" },
      dateField: "createdAt",
      valueName: "users",
      range: ranges.current,
      bucketInfo,
    });
    return res.status(200).json({ message: "Customer growth data fetched successfully", userGrowth });
  } catch (error) {
    console.error("Customer growth data error:", error.message);
    return res.status(500).json({ message: "Failed to fetch customer growth data" });
  }
};

export const getRecentActivity = async (req, res) => {
  const ranges = getDashboardRanges(req);
  if (ranges.error) return res.status(400).json({ message: ranges.error });
  try {
    const activities = await Order.find({ orderDate: { $gte: ranges.current.startDate, $lt: ranges.current.endDate } })
      .populate("customer", "name email")
      .sort({ orderDate: -1, _id: -1 })
      .limit(10)
      .lean();
    const formattedActivities = activities.map((order) => ({
      id: order.orderId,
      customer: order.customer?.name || "Unknown Customer",
      email: order.customer?.email || "",
      amount: `$${Number(order.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: order.status,
      date: order.orderDate,
    }));
    return res.status(200).json({ message: "Recent activity fetched successfully", activities: formattedActivities });
  } catch (error) {
    console.error("Recent activity error:", error.message);
    return res.status(500).json({ message: "Failed to fetch recent activity" });
  }
};
