import User from "../models/user.js";
import Order from "../models/order.js";

export const getReportStats = async (req, res) => {
  try {
    const period = Number(req.query.period) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const totalCustomers = await User.countDocuments({
      createdAt: {
        $gte: startDate,
      },
    });

    const orders = await Order.find({
      orderDate: {
        $gte: startDate,
      },
    });
    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      (order) => order.status === "Completed"
    );
    const totalRevenue = completedOrders.reduce(
      (total, order) => total + order.amount,
      0
    );
    const averageOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;

    return res.status(200).json({
      message: "Report statistics fetched successfully",
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Report stats error:", error);
    return res.status(500).json({
      message: "Failed to fetch report statistics",
    });
  }
};

export const getReportRevenue = async (req, res) => {
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
      message: "Report revenue data fetched successfully",
      revenue: formattedRevenue,
    });
  } catch (error) {
    console.error("Report revenue error:", error);
    return res.status(500).json({
      message: "Failed to fetch report revenue data",
    });
  }
};

export const getReportTable = async (req, res) => {
  try {
    const period = Number(req.query.period) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const reportData = await Order.aggregate([
      {
        $match: {
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
            day: { $dayOfMonth: "$orderDate" },
          },
          orders: {
            $sum: 1,
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Completed"] },
                "$amount",
                0,
              ],
            },
          },
          customers: {
            $addToSet: "$customer",
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          orders: 1,
          revenue: 1,
          customers: {
            $size: "$customers",
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    const formattedData = reportData.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      orders: item.orders,
      revenue: item.revenue,
      customers: item.customers,
    }));

    return res.status(200).json({
      message: "Report table data fetched successfully",
      reports: formattedData,
    });
  } catch (error) {
    console.error("Report table error:", error);
    return res.status(500).json({
      message: "Failed to fetch report table data",
    });
  }
};