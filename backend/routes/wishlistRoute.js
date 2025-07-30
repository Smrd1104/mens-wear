import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import authUser from '../middleware/auth.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/', authUser, getWishlist);       // ✅ updated
wishlistRouter.post('/', authUser, addToWishlist);
wishlistRouter.delete('/', authUser, removeFromWishlist);

export default wishlistRouter;
