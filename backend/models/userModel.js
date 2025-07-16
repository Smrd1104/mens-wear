import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, // ✅ Fixed here
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    addresses: [addressSchema], // ✅ Add this line

}, { minimize: false })

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel