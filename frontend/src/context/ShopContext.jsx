import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from "axios"

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

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState({})
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const hasFetched = useRef(false); // 👈 this line is important

  const addToCart = async (itemId, size) => {

    if (!size) {
      toast.error('select product size');
      return;
    }

    let cartData = structuredClone(cartItems)

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;

      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData)




    if (token) {
      try {
        await axios.post(backendUrl + "/api/cart/add", { itemId, size }, { headers: { token } })
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }

  }







  const getCartCount = (item) => {
    let totalCount = 0;

    for (const items in cartItems) {
      for (item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item]
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    return totalCount
  }


const updateQuantity = async (itemId, size, quantity) => {
  const cartData = structuredClone(cartItems);

  if (quantity === 0) {
    // Delete the size from the item
    delete cartData[itemId][size];

    // If no sizes left for that item, delete the item entirely
    if (Object.keys(cartData[itemId]).length === 0) {
      delete cartData[itemId];
    }
  } else {
    cartData[itemId][size] = quantity;
  }

  setCartItems(cartData);

  if (token) {
    try {
      await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity },
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
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))

      getUserCart(localStorage.getItem('token'));
    }
  }, [])



  useEffect(() => {
    console.log(cartItems)
  }, [cartItems])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setProducts,
    token, setToken,
    setCartItems
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
