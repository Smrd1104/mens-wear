import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, showSearch, setSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Show the search bar only on "collection" pages when showSearch is true
  useEffect(() => {
    if (location.pathname.includes('collection') && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  // Don't render anything if not visible
  if (!showSearch || !visible) return null;

  return (
    <div className="bg-gray-50 text-center pt-22  pb-3">
      <div className="inline-flex items-center gap-3">
        {/* Search Input */}
        <div className="flex items-center border border-gray-400 px-5 rounded-full w-[75vw] sm:w-[50vw]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-inherit text-sm py-2"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4" />
        </div>

        {/* Close (X) icon */}
        <img
          onClick={() => setShowSearch(false)}
          src={assets.cross_icon}
          alt="close"
          className="w-3 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SearchBar;
