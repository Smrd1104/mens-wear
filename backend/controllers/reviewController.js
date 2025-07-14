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
