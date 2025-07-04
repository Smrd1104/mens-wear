import express from "express"
import { placeOrder, placeOrderRazorPay, allOrders, userOrders, updateStatus, verifyRazorpay } from "../controllers/orderController.js"

import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"


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


export default orderRouter
