import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    const displayImage =
        Array.isArray(image) && image.length > 0
            ? image[0]
            : "/fallback.jpg"; // Use a default image if not available

    return (
        <div>
            <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
                <div className="overflow-hidden">
                    <img
                        src={displayImage}
                        alt={name}
                        className="hover:scale-110 transition-all ease-in-out"
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
