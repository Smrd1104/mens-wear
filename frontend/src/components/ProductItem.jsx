import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import { assets } from "../assets/frontend_assets/assets";

const ProductItem = ({ id, image, name, price, bestseller, latest, discountPrice }) => {
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

  const formatPrice = (value) => {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="relative group">
      {/* Best Seller Tag */}
      {bestseller && (
        <span className="absolute top-2 left-2 z-10 bg-red-500/70 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          Best Seller
        </span>
      )}

      {/* New Tag */}
      {latest && (
        <span className="absolute top-2 left-2  z-10 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          Latest
        </span>
      )}


      {/* Wishlist Icon */}
      {/* <button
        onClick={handleWishlistToggle}
        className="absolute top-2 md:right-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:text-red-500 transition"
      >
        {isWishlisted ? (
          <Heart className="text-red-600" size={18} />
        ) : (
          <HeartOff className="text-gray-400 group-hover:text-red-600" size={18} />
        )}
      </button> */}
      <button
        onClick={handleWishlistToggle}
        className=" absolute top-2 lg:right-2  md:right-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:text-red-500 transition"
      >
        {isWishlisted ? (
          <Heart className="text-red-600" size={18} />
        ) : (
          <HeartOff className="text-gray-400 group-hover:text-red-600" size={18} />
        )}
      </button>


      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer block">
        <div className="overflow-hidden ">
          <img
            src={displayImage}
            alt={name}
            className="hover:scale-110 object-cover md:object-top-right w-full max-w-[350px] md:h-[350px] h-[300px] transition-all ease-in-out duration-300"
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <div className="flex flx-row justify-between">
          <div className="flex items-center gap-1 ">
            <img src={assets.star_icon} className="w-3.5" alt="" />
            <img src={assets.star_icon} className="w-3.5" alt="" />
            <img src={assets.star_icon} className="w-3.5" alt="" />
            <img src={assets.star_icon} className="w-3.5" alt="" />
            <img src={assets.star_dull_icon} className="w-3.5" alt="" />
            <p className="pl-2">(122)</p>
          </div>

        </div>
        <div className="flex flex-row gap-2">
          <p className="text-sm font-medium text-red-600">
            {currency}
            {formatPrice(price)}
          </p>
          <p className="text-sm font-medium line-through">
            {currency}
            {formatPrice(discountPrice)}
          </p>
        </div>
      </Link>


    </div>
  );
};

export default ProductItem;
