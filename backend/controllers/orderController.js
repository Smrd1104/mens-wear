import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

// placing order using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            payment:false,
            paymentMethod: "COD",
            status: 'Order Placed',
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        
        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed", order: newOrder })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// placing order using stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentId } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            paymentId,
            status: 'Order Placed',
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        
        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed", order: newOrder })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// placing order using razorpay method
const placeOrderRazorPay = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentId } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "RazorPay",
            paymentId,
            status: 'Order Placed',
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        
        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed", order: newOrder })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// All orders to admin panel
const allOrders = async (req, res) => {
    try {
        // Sort by newest orders first
        const orders = await orderModel.find({})
            .sort({ date: -1 })
            .populate('userId', 'name email') // Populate user details
            
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// User's orders
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        // Sort by newest orders first
        const orders = await orderModel.find({ userId })
            .sort({ date: -1 })
            
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        
        // Validate status
        const validStatuses = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' })
        }

        // Update order status
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('userId', 'name email')

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        // If order is delivered and payment was COD, mark as paid
        if (status === 'Delivered' && updatedOrder.paymentMethod === 'COD') {
            updatedOrder.paymentStatus = 'paid'
            await updatedOrder.save()
        }

        res.json({ 
            success: true, 
            message: 'Order status updated',
            order: updatedOrder 
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorPay, 
    allOrders, 
    userOrders, 
    updateStatus 
}