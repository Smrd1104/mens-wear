import Wishlist from '../models/wishlistModel.js';

// GET Wishlist Items
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.body.userId }).populate('items.productId');

    if (!wishlist) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching wishlist" });
  }
};

// ADD to Wishlist
export const addToWishlist = async (req, res) => {
  const { productId, userId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [{ productId }]
      });
    } else {
      const alreadyExists = wishlist.items.some(item => item.productId.toString() === productId);
      if (!alreadyExists) {
        wishlist.items.push({ productId });
      }
    }

    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding to wishlist" });
  }
};

// REMOVE from Wishlist
export const removeFromWishlist = async (req, res) => {
  const { productId, userId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
      await wishlist.save();
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error removing from wishlist" });
  }
};
