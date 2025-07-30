import userModel from "../models/userModel.js";

// ✅ Add product to user cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size, color } = req.body;
    const userId = req.user._id;

    if (!itemId || !size || !color || color === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid cart input" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};
    const variantKey = `${size}|${color}`;

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][variantKey] = (cartData[itemId][variantKey] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Update user cart item quantity
const updateCart = async (req, res) => {
  try {
    const { itemId, size, color, quantity } = req.body;
    const userId = req.user._id;

    if (!itemId || !size || !color || quantity == null) {
      return res.status(400).json({ success: false, message: "Invalid update input" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = { ...userData.cartData };
    const variantKey = `${size}|${color}`;

    if (quantity === 0) {
      if (cartData[itemId] && cartData[itemId][variantKey]) {
        delete cartData[itemId][variantKey];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][variantKey] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, getUserCart, updateCart };
