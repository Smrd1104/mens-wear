
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Razorpay from "razorpay"; // Note lowercase 'p'
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import path from 'path';
import skuModel from "../models/skuModel.js"



const razorpayInstance = new Razorpay({
  key_id: "rzp_test_PKroQEAnCB7ol3",
  key_secret: "Fxjtaomc2wirn3D4T3TLV3YI"
});





const currency = "inr"
const deliverCharge = 50


// ✅ Place this here - after imports and before actual route/controller functions
const updateSKUQuantities = async (items) => {
  for (const item of items) {
    const { productId, size, color, quantity } = item;
    const skuCode = `${productId}-${size}-${color}`;

    await skuModel.findOneAndUpdate(
      { skuCode },
      {
        $inc: {
          quantityAvailable: -quantity,
          quantityReserved: 0 // optional reset
        }
      },
      { new: true }
    );
  }
};


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

    // 🟢 UPDATE SKU QUANTITIES
    await updateSKUQuantities(items);

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
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // 🔐 Signature verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || "Fxjtaomc2wirn3D4T3TLV3YI")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature. Payment verification failed." });
    }

    // ✅ Fetch order using Razorpay order ID (receipt = our MongoDB order _id)
    const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
    const orderId = razorpayOrder.receipt;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ✅ Update payment and SKUs
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await updateSKUQuantities(order.items);
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    console.error("Error verifying Razorpay:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};


// const verifyRazorpay = async (req, res) => {
//   try {
//     const { userId, razorpay_order_id } = req.body

//     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
//     if (orderInfo.status === 'paid') {
//       await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
//       await userModel.findByIdAndUpdate(userId, { cartData: {} })
//       res.json({ success: true, message: "Payment Successful" })


//     } else {
//       res.json({ success: false, message: "Payment Failed" })

//     }
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })


//   }
// }




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

export const generateInvoiceCommon = async (orderId, res, mode = 'download') => {
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const user = await userModel.findById(order.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const invoiceData = {
      invoiceNumber: `INV-${orderId.slice(-6).toUpperCase()}`,
      invoiceDate: new Date(order.date).toLocaleDateString('en-GB'),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
      poNumber: `PO-${orderId.slice(0, 6).toUpperCase()}`,
      company: {
        name: 'Mens Wear',
        address: '25, Street\nChennai, MH 400001\nIndia'
      },
      billTo: {
        name: user.name || 'Customer',
        address: `${order.address?.street || ''}\n${order.address?.city}, ${order.address?.state} ${order.address?.zipcode}\n${order.address?.country}`
      },
      shipTo: {
        name: user.name || 'Customer',
        address: `${order.address?.street || ''}\n${order.address?.city}, ${order.address?.state} ${order.address?.zipcode}\n${order.address?.country}`
      },
      items: order.items.map(item => ({
        qty: item.quantity,
        description: item.name,
        unitPrice: item.price
      })),
      subtotal: order.amount,
      taxRate: 6.25,
      total: parseFloat((order.amount * 1.0625).toFixed(2))
    };

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    // Load fonts
    const fontPathRegular = path.resolve('fonts/NotoSans-Regular.ttf');
    const fontPathBold = path.resolve('fonts/NotoSans-Bold.ttf');
    doc.registerFont('NotoSans', fontPathRegular);
    doc.registerFont('NotoSans-Bold', fontPathBold);

    // Set headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      mode === 'view'
        ? `inline; filename=invoice-${orderId}.pdf`
        : `attachment; filename=invoice-${orderId}.pdf`
    );

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => res.end(Buffer.concat(buffers)));

    // === Header Bar ===
    doc.rect(0, 0, doc.page.width, 30).fill('#2e6cb8');

    // === Company Info ===
    doc.fillColor('black')
      .font('NotoSans-Bold')
      .fontSize(14)
      .text(invoiceData.company.name, 50, 40)
      .font('NotoSans')
      .fontSize(10)
      .text(invoiceData.company.address, 50, 60);

    // === Invoice Info Block ===
    const infoY = 120;
    doc.fontSize(10)
      .font('NotoSans-Bold')
      .text('BILL TO', 50, infoY)
      .text('SHIP TO', 220, infoY)
      .text('INVOICE #', 400, infoY)

      .font('NotoSans')
      .text(invoiceData.billTo.name, 50, infoY + 15)
      .text(invoiceData.billTo.address, 50, infoY + 30)
      .text(invoiceData.shipTo.name, 220, infoY + 15)
      .text(invoiceData.shipTo.address, 220, infoY + 30)
      .text(invoiceData.invoiceNumber, 480, infoY);

    doc.font('NotoSans-Bold')
      .text('INVOICE DATE', 400, infoY + 60)
      .text('P.O.#', 400, infoY + 75)
      .text('DUE DATE', 400, infoY + 90);

    doc.font('NotoSans')
      .text(invoiceData.invoiceDate, 480, infoY + 60)
      .text(invoiceData.poNumber, 480, infoY + 75)
      .text(invoiceData.dueDate, 480, infoY + 90);

    // === Invoice Total Heading ===
    doc.moveDown(5)
      .fontSize(16)
      .font('NotoSans-Bold')
      .text('Invoice Total', 50)
      .text(`₹${invoiceData.total.toFixed(2)}`, 460, doc.y - 16, { align: 'right' });

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // === Table Header ===
    doc.moveDown(1.5)
      .fontSize(10)
      .font('NotoSans-Bold');

    const tableTop = doc.y;
    const itemX = { qty: 50, desc: 100, unit: 350, total: 450 };

    doc.text('QTY', itemX.qty, tableTop)
      .text('DESCRIPTION', itemX.desc, tableTop)
      .text('UNIT PRICE', itemX.unit, tableTop)
      .text('AMOUNT', itemX.total, tableTop);

    doc.moveTo(50, doc.y + 12).lineTo(550, doc.y + 12).stroke();
    doc.moveDown(1).font('NotoSans');

    // === Table Rows ===
    invoiceData.items.forEach(item => {
      const y = doc.y;
      const amount = item.qty * item.unitPrice;

      doc.text(item.qty.toString(), itemX.qty, y)
        .text(item.description, itemX.desc, y, { width: 240 })
        .text(`₹${item.unitPrice.toFixed(2)}`, itemX.unit, y, { width: 80, align: 'right' })
        .text(`₹${amount.toFixed(2)}`, itemX.total, y, { width: 80, align: 'right' });

      doc.moveDown(0.5);
    });

    // === Totals Summary ===
    const taxAmount = invoiceData.total - invoiceData.subtotal;
    const summaryY = doc.y + 10;

    doc.fontSize(10).font('NotoSans')
      .text('Subtotal:', 400, summaryY)
      .text(`₹${invoiceData.subtotal.toFixed(2)}`, 500, summaryY, { align: 'right' })
      .text(`Sales Tax ${invoiceData.taxRate}%:`, 400, summaryY + 15)
      .text(`₹${taxAmount.toFixed(2)}`, 500, summaryY + 15, { align: 'right' })
      .font('NotoSans-Bold')
      .text('Total:', 400, summaryY + 30)
      .text(`₹${invoiceData.total.toFixed(2)}`, 500, summaryY + 30, { align: 'right' });

    // === Terms Section ===
    doc.moveDown(4);
    doc.font('NotoSans-Bold').text('TERMS & CONDITIONS');
    doc.font('NotoSans')
      .text('Payment is due within 15 days.')
      .text(`Please make checks payable to: ${invoiceData.company.name}`);

    // === Footer Bar ===
    doc.rect(0, doc.page.height - 30, doc.page.width, 30).fill('#2e6cb8');

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to generate invoice' });
  }
};


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

