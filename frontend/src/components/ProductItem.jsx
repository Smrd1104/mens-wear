import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import { assets } from "../assets/frontend_assets/assets";

const ProductItem = ({ id, image, name, price, bestseller, collection ,discountPrice}) => {
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
      {/* Best Seller Tag */}
      {bestseller && (
        <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          Best Seller
        </span>
      )}

      {/* New Tag */}
      {collection === "latest" && (
        <span className="absolute top-2 left-2 translate-x-full ml-2 z-10 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          New
        </span>
      )}


      {/* Wishlist Icon */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:text-red-500 transition"
      >
        {isWishlisted ? (
          <Heart className="text-red-600" size={18} />
        ) : (
          <HeartOff className="text-gray-400 group-hover:text-red-600" size={18} />
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
        <div className="flex items-center gap-1 ">
          <img src={assets.star_icon} className="w-3.5" alt="" />
          <img src={assets.star_icon} className="w-3.5" alt="" />
          <img src={assets.star_icon} className="w-3.5" alt="" />
          <img src={assets.star_icon} className="w-3.5" alt="" />
          <img src={assets.star_dull_icon} className="w-3.5" alt="" />
          <p className="pl-2">(122)</p>
        </div>
        <div className="flex flex-row gap-5">
          <p className="text-sm font-medium">
            {currency}
            {price}
          </p>
          <p className="text-sm font-medium line-through">
            {currency}
            {discountPrice}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
