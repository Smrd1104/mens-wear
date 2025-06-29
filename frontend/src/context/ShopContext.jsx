// src/context/ShopContext.jsx
import { createContext } from "react";
import { products } from "../assets/frontend_assets/assets";

// Create context
export const ShopContext = createContext();

// Provider component
const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const deliver_fee = 10;

  const value = {
    products,
    currency,
    deliver_fee,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
