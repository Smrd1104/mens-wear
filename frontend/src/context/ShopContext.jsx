import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useMemo } from 'react';
import PropTypes from 'prop-types';

// Create context
export const ShopContext = createContext();

// Provider component
export const ShopProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 50;
  // axios setup (React example)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Example call
  // axios.get(`${backendUrl}/api/products`);
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState({})
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const hasFetched = useRef(false); // 👈 this line is important

  const [wishlist, setWishlist] = useState([]);



  // ✅ Fetch wishlist using Axios
  const fetchWishlist = async () => {
    if (!token) return; // Prevent empty token calls

    try {
      const res = await axios.get(`${backendUrl}/api/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ required by auth middleware
      });

      console.log("Fetched wishlist response:", res.data);

      if (Array.isArray(res.data)) {
        setWishlist(res.data.map(item => item.productId));
      } else {
        toast.error("Unexpected wishlist response format");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error(error.response?.data?.message || "Failed to load wishlist");
    }
  };



  // ✅ Add to wishlist using Axios
  const addToWishlist = async (productId) => {
    try {
      await axios.post(`${backendUrl}/api/wishlist`, { userId, productId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => [...prev, productId]);
      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
  };




  // ✅ Remove from wishlist using Axios
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${backendUrl}/api/wishlist`, {
        data: { userId, productId }
      });
      setWishlist((prev) => [...prev, productId]);
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchWishlist();
    }
  }, [token, userId]);




  const addToCart = async (itemId, size, color) => {
    if (!size) {
      toast.error('Select product size');
      return;
    }
    if (!color) {
      toast.error('Select product color');
      return;
    }

    let cartData = structuredClone(cartItems);

    // Create a unique key combining size and color
    const variantKey = `${size}|${color}`;

    if (cartData[itemId]) {
      if (cartData[itemId][variantKey]) {
        cartData[itemId][variantKey] += 1;
      } else {
        cartData[itemId][variantKey] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][variantKey] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + "/api/cart/add",
          { itemId, size, color },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }





const getCartCount = () => {
  let totalCount = 0;

  for (const itemId in cartItems) {
    for (const variantKey in cartItems[itemId]) {
      try {
        if (cartItems[itemId][variantKey] > 0) {
          totalCount += cartItems[itemId][variantKey];
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return totalCount;
};



  const updateQuantity = async (itemId, variantKey, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity === 0) {
      delete cartData[itemId][variantKey];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][variantKey] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        // Split variantKey back to size and color
        const [size, color] = variantKey.split('|');
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, color, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };



  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }

    return totalAmount;
  };

  const getProductsData = async (e) => {

    try {
      const response = await axios.get(backendUrl + "/api/product/list")
      if (response.data.success) {
        setProducts(response.data.products)
        toast.success(response.data.message)

      } else {
        toast.error(error.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getUserCart = async (token) => {

    try {
      const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } })

      if (response.data.success) {
        setCartItems(response.data.cartData)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true; // ✅ ensures it runs once

    getProductsData();

  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken) {
      setToken(storedToken);
      setUserId(storedUserId); // ✅ now sets in memory
      getUserCart(storedToken);
    }
  }, []);



  // useEffect(() => {
  //   if (!token && localStorage.getItem('token')) {
  //     setToken(localStorage.getItem('token'))

  //     getUserCart(localStorage.getItem('token'));
  //   }
  // }, [])



  useEffect(() => {
    console.log(cartItems)
  }, [cartItems])


const value = useMemo(() => ({
  products,
  currency,
  delivery_fee,
  search, setSearch,
  showSearch, setShowSearch,
  cartItems, setCartItems,
  addToCart,
  getCartCount,
  updateQuantity,
  getCartAmount,
  navigate,
  backendUrl,
  token, setToken,
  wishlist, setWishlist,
  addToWishlist,
  removeFromWishlist,
  userId, setUserId,
  setProducts,
}), [
  products,
  currency,
  delivery_fee,
  search,
  showSearch,
  cartItems,
  addToCart,
  getCartCount,
  updateQuantity,
  getCartAmount,
  navigate,
  backendUrl,
  token,
  wishlist,
  addToWishlist,
  removeFromWishlist,
  userId,
  setProducts
]);


 return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

