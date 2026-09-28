import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import Order from "./models/order.js";

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const users = await User.find({});

    if (users.length === 0) {
      console.log("No users found. Create users first.");
      process.exit(1);
    }

    await Order.deleteMany({});

    const orders = [
      {
        orderId: "ORD-1001",
        customer: users[0]._id,
        amount: 2499,
        status: "Completed",
        orderDate: new Date("2026-01-05"),
      },
      {
        orderId: "ORD-1002",
        customer: users[1 % users.length]._id,
        amount: 1599,
        status: "Completed",
        orderDate: new Date("2026-01-12"),
      },
      {
        orderId: "ORD-1003",
        customer: users[2 % users.length]._id,
        amount: 3299,
        status: "Completed",
        orderDate: new Date("2026-02-08"),
      },
      {
        orderId: "ORD-1004",
        customer: users[3 % users.length]._id,
        amount: 899,
        status: "Pending",
        orderDate: new Date("2026-02-18"),
      },
      {
        orderId: "ORD-1005",
        customer: users[0]._id,
        amount: 4599,
        status: "Completed",
        orderDate: new Date("2026-03-03"),
      },
      {
        orderId: "ORD-1006",
        customer: users[1 % users.length]._id,
        amount: 1299,
        status: "Completed",
        orderDate: new Date("2026-03-17"),
      },
      {
        orderId: "ORD-1007",
        customer: users[2 % users.length]._id,
        amount: 2199,
        status: "Failed",
        orderDate: new Date("2026-04-02"),
      },
      {
        orderId: "ORD-1008",
        customer: users[3 % users.length]._id,
        amount: 3899,
        status: "Completed",
        orderDate: new Date("2026-04-11"),
      },
      {
        orderId: "ORD-1009",
        customer: users[0]._id,
        amount: 1799,
        status: "Completed",
        orderDate: new Date("2026-05-06"),
      },
      {
        orderId: "ORD-1010",
        customer: users[1 % users.length]._id,
        amount: 4999,
        status: "Pending",
        orderDate: new Date("2026-05-21"),
      },
      {
        orderId: "ORD-1011",
        customer: users[2 % users.length]._id,
        amount: 2799,
        status: "Completed",
        orderDate: new Date("2026-06-09"),
      },
      {
        orderId: "ORD-1012",
        customer: users[3 % users.length]._id,
        amount: 1499,
        status: "Completed",
        orderDate: new Date("2026-06-23"),
      },
    ];

    await Order.insertMany(orders);

    console.log(`${orders.length} orders inserted successfully`);

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedOrders();