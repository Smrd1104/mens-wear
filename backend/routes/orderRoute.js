import express from "express"
import { placeOrder, placeOrderRazorPay, allOrders, userOrders, updateStatus, verifyRazorpay, whatsappOrder } from "../controllers/orderController.js"

import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"
import orderModel from "../models/orderModel.js"


const orderRouter = express.Router()

// admin features

orderRouter.post("/list", adminAuth, allOrders)
orderRouter.post("/status", adminAuth, updateStatus)


// admin features

orderRouter.post("/place", authUser, placeOrder)
orderRouter.post("/razorpay", authUser, placeOrderRazorPay)

// user features
orderRouter.post("/userorders", authUser, userOrders)

// verify payment
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay)


// whatsapp
orderRouter.post('/whatsapp', authUser, whatsappOrder)

// trackorder
orderRouter.post('/track', authUser, async (req, res) => {
    try {
        console.log("🔍 Incoming /track request body:", req.body);

        const { orderId } = req.body;

        if (!orderId) {
            console.log("❌ Missing orderId");
            return res.status(400).json({ success: false, message: "orderId is required" });
        }

        const order = await orderModel.findOne({ orderId });

        if (!order) {
            console.log("❌ Order not found for:", orderId);
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        console.log("✅ Order found:", order._id);

        res.status(200).json({ success: true, tracking: order.tracking || [] });
    } catch (err) {
        console.error("❗TRACK ORDER ERROR:", err); // Log the actual error
        res.status(500).json({ success: false, message: err.message });
    }
});







export default orderRouter
