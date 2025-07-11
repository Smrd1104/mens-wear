// controllers/dashboardController.js
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalRevenueResult = await orderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    const allOrders = await orderModel.find()
      .sort({ date: -1 })
      .populate("userId", "name");

    const paymentBreakdown = await orderModel.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
    ]);

    const statusStats = await orderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const allProductSales = await orderModel.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } }
    ]);




    res.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalRevenue: totalRevenueResult[0]?.total || 0,
          totalUsers,
          totalProducts,
        },
        allOrders,
        paymentBreakdown,
        statusStats,
        allProductSales,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};
