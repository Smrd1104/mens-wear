import express from "express";
import { getReviewsByProduct, createReview, getAllReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();


reviewRouter.get("/all", getAllReviews); // ✅ add this route


// GET /api/reviews/:productId
reviewRouter.get("/:productId", getReviewsByProduct);

// POST /api/reviews
reviewRouter.post("/", createReview);


export default reviewRouter;
