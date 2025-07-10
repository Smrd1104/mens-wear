import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import authUser from '../middleware/authUser.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/', authUser, getWishlist);         // Use decoded userId from token
wishlistRouter.post('/', authUser, addToWishlist);
wishlistRouter.delete('/', authUser, removeFromWishlist);

export default wishlistRouter;
