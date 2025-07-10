import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import authUser from '../middleware/auth.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/:userId', authUser, getWishlist);
wishlistRouter.post('/', authUser, authUser, addToWishlist);
wishlistRouter.delete('/', authUser, authUser, removeFromWishlist);

export default wishlistRouter;
