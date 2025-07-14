import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },

  adminReply: {
    type: String, default: ""
  }, // ✅ Add this line

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Review", reviewSchema);
