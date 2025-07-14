import Review from "../models/reviewModel.js";

// @desc Get all reviews for a product
export const getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};

// @desc Create a new review
export const createReview = async (req, res) => {
    const { productId, username, rating, comment } = req.body;

    if (!productId || !username || !rating || !comment) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newReview = new Review({ productId, username, rating, comment });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: "Failed to create review", error: error.message });
    }
};


// @desc Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch all reviews", error: error.message });
    }
};


// reply.js
// PATCH /api/reviews/reply/:id
export const replyToReview = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { adminReply: reply },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: "Failed to reply to review", error: error.message });
  }
};

