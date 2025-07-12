import mongoose from 'mongoose';

const skuSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    skuCode: { type: String, required: true, unique: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantityAvailable: { type: Number, default: 0 },
    quantityReserved: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('sku', skuSchema);
