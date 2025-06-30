import { createContext, useState } from "react";
import { products } from "../assets/frontend_assets/assets";

// Create context
export const ShopContext = createContext();

// Provider component
export const ShopProvider = ({ children }) => {
  const currency = "₹";
  const deliver_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const value = {
    products,
    currency,
    deliver_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
