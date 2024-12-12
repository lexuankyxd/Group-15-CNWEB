const Order = require("../models/orderModel.js");

exports.getRevenueInTimePeriod = async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    if (!startDate || !endDate || startDate > endDate) {
      throw new Error("Invalid date range provided.");
    }

    // Query for finished orders within the specified date range
    const orders = await Order.aggregate([
      {
        $match: {
          status: "Hoàn thành", // Filter for finished orders
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by date
          },
          orders: { $push: "$$ROOT" }, // Push the entire order document into an array
          totalRevenue: { $sum: "$totalPrice" }, // Calculate total revenue for the day
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
    ]);
    sum = 0;
    orders.forEach((element) => {
      sum += parseInt(element.totalRevenue);
    });
    res.status(200).json({
      sum,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductOrderCount = async (req, res) => {
  const { prodId } = req.body;
};

exports.getAllProductOrderCount = async (req, res) => {};
