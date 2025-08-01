import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    latest: { type: Boolean, default: false },
    festive: { type: Boolean, default: false },
    trending:{type:Boolean,default:false},
    date: { type: Number, required: true },
    colors: {
        type: [String], // Array of color codes like "#ffffff"
        default: []
    }

})

const productModel = mongoose.model.product || mongoose.model("product", productSchema);

export default productModel