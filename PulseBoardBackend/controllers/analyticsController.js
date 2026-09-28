import User from "../models/user.js";
import Order from "../models/order.js";

export const getAnalyticsStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({
      role: "User",
    });
    const totalOrders = await Order.countDocuments();

    const convertedUsers = await Order.distinct("customer", {
      status: "Completed",
    });

    const totalUsers = await User.countDocuments();

    const conversionRate = totalUsers === 0 ? 0 : (convertedUsers.length / totalUsers) * 100;

    return res.status(200).json({
      message: "Analytics statistics fetched successfully",
      stats: {
        totalCustomers,
        totalOrders,
        conversionRate: Number(conversionRate.toFixed(1)),
      },
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return res.status(500).json({
      message: "Failed to fetch analytics statistics",
    });
  }
};

export const getAnalyticsRevenue = async (req, res) => {
  try {
    const period = Number(req.query.period) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const revenue = await Order.aggregate([
      {
        $match: {
          status: "Completed",
          orderDate: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedRevenue = revenue.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      revenue: item.revenue,
    }));

    return res.status(200).json({
      message: "Analytics revenue data fetched successfully",
      revenue: formattedRevenue,
    });
  } catch (error) {
    console.error("Analytics revenue error:", error);
    return res.status(500).json({
      message: "Failed to fetch analytics revenue data",
    });
  }
};

export const getUserAcquisition = async (req, res) => {
  try {
    const period = Number(req.query.period) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const users = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          users: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedUsers = users.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      users: item.users,
    }));

    return res.status(200).json({
      message: "User acquisition data fetched successfully",
      userAcquisition: formattedUsers,
    });
  } catch (error) {
    console.error("User acquisition error:", error);
    return res.status(500).json({
      message: "Failed to fetch user acquisition data",
    });
  }
};

export const getTrafficSources = async (req, res) => {
  try {
    const period = Number(req.query.period) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const trafficSources = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: "$source",
          users: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          users: -1,
        },
      },
    ]);

    const formattedSources = trafficSources.map((item) => ({
      source: item._id,
      users: item.users,
    }));

    return res.status(200).json({
      message: "Traffic source data fetched successfully",
      trafficSources: formattedSources,
    });
  } catch (error) {
    console.error("Traffic source error:", error);
    return res.status(500).json({
      message: "Failed to fetch traffic source data",
    });
  }
};