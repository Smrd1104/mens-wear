import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react"; // You can replace this with any icon library

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    const displayImage =
        Array.isArray(image) && image.length > 0
            ? image[0]
            : "/fallback.jpg"; // Fallback image

    return (
        <div className="relative group">
            {/* Wishlist icon */}
            <button className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:text-red-500 transition">
                <Heart size={18} className="text-gray-500 group-hover:text-red-600" />
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
