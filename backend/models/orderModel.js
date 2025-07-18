import mongoose from "mongoose"
const trackingSchema = new mongoose.Schema({
    status: String,
    message: String,
    timestamp: Date
});


const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // ✅ FIXED
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    tracking: [trackingSchema], // ⬅️ added tracking field

})





const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel


