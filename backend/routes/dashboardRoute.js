// routes/dashboardRoute.js
import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import adminAuth from "../middleware/adminAuth.js"; // Optional if admin auth is required

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", adminAuth, getDashboardStats); // or remove adminAuth if public

export default dashboardRouter;
