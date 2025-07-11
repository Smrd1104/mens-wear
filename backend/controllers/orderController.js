
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Razorpay from "razorpay"; // Note lowercase 'p'
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';



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
        const { orderId, status } = req.body;

        const messages = {
            'Order Placed': 'Your order has been placed.',
            'Processing': 'Seller has processed your order.',
            'Out for Delivery': 'Your item is out for delivery.',
            'Delivered': 'Your item has been delivered.',
            'Cancelled': 'Your order has been cancelled.'
        };

        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.status = status;
        order.tracking.push({
            status,
            message: messages[status],
            timestamp: new Date()
        });

        if (status === 'Delivered' && order.paymentMethod === 'COD') {
            order.payment = true;
        }

        await order.save();
        res.json({ success: true, message: 'Status updated', order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};



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


const generateInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderModel.findById(orderId).populate('userId', 'name email');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // Convert PDF document to a readable stream
        const stream = new Readable();
        stream._read = () => {};
        doc.pipe(stream);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(20).text("Invoice", { align: 'center' });
        doc.moveDown();

        // User Info
        doc.fontSize(12).text(`Customer Name: ${order.userId.name}`);
        doc.text(`Email: ${order.userId.email}`);
        doc.text(`Order ID: ${order._id}`);
        doc.text(`Order Date: ${new Date(order.date).toLocaleDateString()}`);
        doc.moveDown();

        // Address
        doc.fontSize(14).text("Shipping Address:");
        doc.fontSize(12).text(order.address);
        doc.moveDown();

        // Order Items
        doc.fontSize(14).text("Items:");
        order.items.forEach((item, index) => {
            doc.fontSize(12).text(`${index + 1}. ${item.name} - Qty: ${item.quantity} - ₹${item.price}`);
        });
        doc.moveDown();

        // Summary
        doc.fontSize(14).text(`Total Amount: ₹${order.amount}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.text(`Payment Status: ${order.payment ? 'Paid' : 'Unpaid'}`);

        doc.end();

    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ success: false, message: "Failed to generate invoice" });
    }
};






export {
    placeOrder,
    placeOrderRazorPay,
    allOrders,
    userOrders,
    updateStatus,
    verifyRazorpay,
    whatsappOrder,generateInvoice

}

