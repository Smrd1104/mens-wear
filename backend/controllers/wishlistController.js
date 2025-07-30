import Wishlist from '../models/wishlistModel.js';

// GET wishlist
// GET wishlist
export const getWishlist = async (req, res) => {
  try {
   const userId = req.user?._id; // or req.user.id based on your middleware
 // 👈 from decoded token
    if (!userId) return res.status(400).json({ success: false, message: "User ID not found" });

    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// ADD to wishlist
// ADD to wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Please login to add to wishlist" });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
    } else {
      const exists = wishlist.items.some(item => item.productId.toString() === productId);
      if (!exists) {
        wishlist.items.push({ productId });
      }
    }

    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding to wishlist" });
  }
};

// REMOVE from wishlist
// REMOVE from wishlist
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Please login to remove from wishlist" });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
      await wishlist.save();
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing from wishlist" });
  }
};
