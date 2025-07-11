
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Razorpay from "razorpay"; // Note lowercase 'p'
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import path from 'path';



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



// controllers/invoiceController.js



// === Shared Invoice Logic ===
const generateInvoiceCommon = async (orderId, res, mode = 'download') => {
  try {
    const order = await orderModel.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    const user = await userModel.findById(order.userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const invoiceData = {
      invoiceNumber: `INV-${orderId.slice(-6).toUpperCase()}`,
      invoiceDate: new Date(order.date).toLocaleDateString('en-GB'),
      dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-GB'),
      poNumber: `PO-${orderId.slice(0, 6).toUpperCase()}`,
      company: {
        name: 'Mens Wear',
        address: '25, Street\nChennai, MH 400001\nIndia'
      },
      billTo: {
        name: user.name || 'Customer',
        address: `${order.address?.street}\n${order.address?.city}, ${order.address?.state} ${order.address?.zipcode}\n${order.address?.country}`
      },
      items: order.items.map(item => ({
        qty: item.quantity,
        description: item.name,
        unitPrice: item.price
      })),
      subtotal: order.amount,
      taxRate: 6.25,
      total: parseFloat((order.amount * 1.0625).toFixed(2))
    }

    const doc = new PDFDocument({ margin: 50 })
    const buffers = []

    const fontRegular = path.resolve('fonts/NotoSans-Regular.ttf')
    const fontBold = path.resolve('fonts/NotoSans-Bold.ttf')
    doc.registerFont('NotoSans', fontRegular)
    doc.registerFont('NotoSans-Bold', fontBold)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition',
      mode === 'view'
        ? `inline; filename=invoice-${orderId}.pdf`
        : `attachment; filename=invoice-${orderId}.pdf`
    )

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => res.end(Buffer.concat(buffers)))

    // === PDF Layout ===
    doc.font('NotoSans-Bold').fontSize(14).text(invoiceData.company.name, 50, 40)
    doc.font('NotoSans').fontSize(10).text(invoiceData.company.address, 50, 60)

    doc.fontSize(10).font('NotoSans-Bold')
      .text('INVOICE #', 400, 50).font('NotoSans')
      .text(invoiceData.invoiceNumber, 480, 50)

    doc.text('BILL TO', 50, 100).text(invoiceData.billTo.name, 50, 115).text(invoiceData.billTo.address, 50, 130)

    // Table headers
    doc.moveDown(4).fontSize(12).font('NotoSans-Bold').text('QTY', 50).text('DESCRIPTION', 100).text('PRICE', 350).text('AMOUNT', 450)

    doc.font('NotoSans').fontSize(10)
    invoiceData.items.forEach(item => {
      const y = doc.y
      doc.text(item.qty, 50, y)
        .text(item.description, 100, y)
        .text(`₹${item.unitPrice.toFixed(2)}`, 350, y)
        .text(`₹${(item.unitPrice * item.qty).toFixed(2)}`, 450, y)
      doc.moveDown(0.5)
    })

    const taxAmount = invoiceData.total - invoiceData.subtotal
    doc.moveDown(2)
      .text(`Subtotal: ₹${invoiceData.subtotal.toFixed(2)}`, 400)
      .text(`Tax (6.25%): ₹${taxAmount.toFixed(2)}`, 400)
      .font('NotoSans-Bold')
      .text(`Total: ₹${invoiceData.total.toFixed(2)}`, 400)

    doc.end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to generate invoice' })
  }
}

const generateInvoiceForView = (req, res) => generateInvoiceCommon(req.params.orderId, res, 'view')
const generateInvoiceForDownload = (req, res) => generateInvoiceCommon(req.params.orderId, res, 'download')














export {
  placeOrder,
  placeOrderRazorPay,
  allOrders,
  userOrders,
  updateStatus,
  verifyRazorpay,
  whatsappOrder, generateInvoiceForView, generateInvoiceForDownload, 

}

