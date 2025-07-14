import express from "express";
import { getReviewsByProduct, createReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// GET /api/reviews/:productId
reviewRouter.get("/:productId", getReviewsByProduct);

// POST /api/reviews
reviewRouter.post("/", createReview);

export default reviewRouter;
