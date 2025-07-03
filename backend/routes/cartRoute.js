import { addToCart, getUserCart, updateCart } from "../controllers/cartController.js"
import authUser from "../middleware/auth.js"
import express from 'express';

const cartRouter = express.Router()

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/update', authUser, updateCart)
cartRouter.post('/add', authUser, addToCart)

export default cartRouter