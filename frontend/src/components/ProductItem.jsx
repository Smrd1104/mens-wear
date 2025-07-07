import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, wishlist, addToWishlist, removeFromWishlist } = useContext(ShopContext);

  const isWishlisted = wishlist.includes(id);

  const displayImage =
    Array.isArray(image) && image.length > 0 ? image[0] : "/fallback.jpg";

  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevent link click
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <div className="relative group">
      {/* Wishlist icon */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:text-red-500 transition"
      >
        {isWishlisted ? (
          <Heart className="text-red-600" size={18} />
        ) : (
          <Heart className="text-gray-400 group-hover:text-red-600" size={18} />
        )}
      </button>

      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer block">
        <div className="overflow-hidden rounded">
          <img
            src={displayImage}
            alt={name}
            className="hover:scale-110 transition-all ease-in-out duration-300"
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </div>
  );
};

export default ProductItem;
