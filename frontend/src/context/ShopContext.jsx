import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode"; // ✅ Correct

// Create context
export const ShopContext = createContext();

// Provider component
export const ShopProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 50;
  // axios setup (React example)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  // const backendUrl = "http://localhost:5000";

  // Example call
  // axios.get(`${backendUrl}/api/products`);
  const [userId, setUserId] = useState(null);

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored && stored !== "null" ? stored : '';
  });

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState({})
  const navigate = useNavigate()
  const hasFetched = useRef(false); // 👈 this line is important

  const [wishlist, setWishlist] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);



  const fetchWishlist = async () => {
    if (!token || !userId) return;

    try {
      const res = await axios.get(`${backendUrl}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      }
      );

      const wishlistData = res.data?.data?.items || [];
      const productIds = wishlistData.map(item => item.productId._id); // ✅ use populated data
      setWishlist(productIds);
    } catch (error) {
      console.error("Fetch Wishlist Error:", error);
      toast.error("Failed to load wishlist");
    }
  };


  // ✅ Add to wishlist
  const addToWishlist = async (productId) => {
    if (!userId || userId === "null" || userId === undefined) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/wishlist`, { productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        ,
      });

      setWishlist((prev) => [...new Set([...prev, productId])]);
      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Add Wishlist Error:", error);
      toast.error("Failed to add to wishlist");
    }
  };


  // ✅ Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${backendUrl}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        ,
        data: { productId },
      });

      setWishlist((prev) => prev.filter((id) => id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Remove Wishlist Error:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  useEffect(() => {
    if (token && userId && products) {
      fetchWishlist();
    }
  }, [token, userId, products]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded._id); // depending on your token payload
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, [token]);






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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
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
        setProductsLoaded(true);


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
      const response = await axios.post(backendUrl + "/api/cart/get", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

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
    if (token) {
      getUserCart(token);
    }
  }, [token]);


  const fetchSKUs = async (productId) => {
    try {
      const res = await axios.get(`${backendUrl}/api/sku/${productId}`);
      return res.data.data; // Return the latest SKU list
    } catch (error) {
      console.error("Fetch SKU Error:", error);
      toast.error("Failed to fetch SKU data");
      return [];
    }
  };




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
    fetchSKUs,
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
    setProducts, fetchWishlist, productsLoaded, setProductsLoaded
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
    setProducts, fetchWishlist, productsLoaded, setProductsLoaded
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

