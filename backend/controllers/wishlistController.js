import Wishlist from '../models/wishlistModel.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.params.userId }).populate("productId");
        res.json(wishlist);
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const exists = await Wishlist.findOne({ userId, productId });
        if (exists) return res.status(400).json({ message: 'Already in wishlist' });

        const newItem = new Wishlist({ userId, productId });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        await Wishlist.findOneAndDelete({ userId, productId });
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
