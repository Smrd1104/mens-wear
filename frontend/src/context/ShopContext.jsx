import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";

// Create context
export const ShopContext = createContext();

// Provider component
export const ShopProvider = ({ children }) => {
  const currency = "₹";
  const deliver_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({})

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

        }
      }
    }
    return totalCount
  }

  useEffect(() => {
    console.log(cartItems)
  }, [cartItems])

  const value = {
    products,
    currency,
    deliver_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems, addToCart, getCartCount
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
