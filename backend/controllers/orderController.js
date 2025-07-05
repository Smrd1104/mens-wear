
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Razorpay from "razorpay"; // Note lowercase 'p'

// Debug check (add this temporarily)
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_PKroQEAnCB7ol3",
    key_secret: "Fxjtaomc2wirn3D4T3TLV3YI"
});



const currency = "inr"
const deliverCharge = 50



// placing order using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            payment: false,
            paymentMethod: "COD",
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


// verify payment razorpay

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true, message: "Payment Successful" })

        } else {
            res.json({ success: false, message: "Payment Failed" })

        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })


    }
}




// placing order using razorpay method
const placeOrderRazorPay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "RazorPay",
            payment: false,
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: Number(amount) * 100, // ✅ convert rupees to paisa
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

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


const whatsappOrder = async (req, res) => {
    try {
        const { address, items, amount } = req.body;

        // Save WhatsApp order to DB (optional)
        // Example: await Order.create({ type: 'whatsapp', address, items, amount });

        console.log("WhatsApp Order:", { address, items, amount });

        res.json({ success: true, message: "WhatsApp order logged successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to log WhatsApp order" });
    }
};



// tract order  

const trackOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Replace this with 3rd-party tracking API call or internal tracking logic
        const trackingInfo = {
            currentLocation: "Chennai Hub",
            estimatedDelivery: "2025-07-07",
            status: "In Transit",
            route: [
                { location: "Delhi", date: "2025-07-03" },
                { location: "Mumbai", date: "2025-07-04" },
                { location: "Chennai Hub", date: "2025-07-05" },
            ],
        };

        return res.json({ success: true, tracking: trackingInfo });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Tracking failed" });
    }
};


export {
    placeOrder,
    placeOrderRazorPay,
    allOrders,
    userOrders,
    updateStatus,
    verifyRazorpay,
    whatsappOrder,
    trackOrder
}

