import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import { assets } from "../assets/frontend_assets/assets";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";

const ProductItem = ({
  id,
  image,
  name,
  price,
  bestseller,
  latest,
  discountPrice
}) => {
  const { currency, wishlist, addToWishlist, removeFromWishlist, backendUrl } = useContext(ShopContext);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const isWishlisted = wishlist.includes(id);

  const displayImage = Array.isArray(image) && image.length > 0 ? image[0] : "/fallback.jpg";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await axios.get(`${backendUrl}/api/reviews/${id}`);
        const reviews = response.data;

        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / reviews.length;
          setRating(averageRating);
          setReviewCount(reviews.length);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id, backendUrl]);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
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



  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const fractional = rating - fullStars;
    const hasHalfStar = fractional >= 0.25 && fractional <= 0.75;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-yellow-500 text-sm" />);
    }

    if (hasHalfStar && stars.length < 5) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-500 text-sm" />);
    }

    while (stars.length < 5) {
      stars.push(<FontAwesomeIcon key={`empty-${stars.length}`} icon={faStarEmpty} className="text-gray-300 text-sm" />);
    }

    return stars;
  };


  const formatReviewCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count;
  };

  return (
    <div className="relative group">
      {bestseller && (
        <span className="absolute top-2 left-2 z-10 bg-red-500/70 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          Best Seller
        </span>
      )}

      {latest && (
        <span className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          Latest
        </span>
      )}

      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 lg:right-2 md:right-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:text-red-500 transition"
      >
        {isWishlisted ? (
          <Heart className="text-red-600" size={18} />
        ) : (
          <HeartOff className="text-gray-400 group-hover:text-red-600" size={18} />
        )}
      </button>

      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer block">
        <div className="overflow-hidden">
          <img
            src={displayImage}
            alt={name}
            className="hover:scale-110 object-cover md:object-top-right w-full max-w-[350px] md:h-[350px] h-[300px] transition-all ease-in-out duration-300"
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {loadingReviews ? (
              // Show placeholder full stars while loading
              [...Array(5)].map((_, i) => (
                <span key={`loading-${i}`} className="text-yellow-400 text-sm animate-pulse">★</span>
              ))
            ) : (
              renderStars()  // Use your dynamic logic
            )}
          </div>
          <p className="pl-1 text-xs text-gray-600">
            ({loadingReviews ? '...' : formatReviewCount(reviewCount)})
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <p className="text-sm font-medium text-red-600">
            {currency}
            {formatPrice(price)}
          </p>
          {discountPrice && (
            <p className="text-sm font-medium line-through">
              {currency}
              {formatPrice(discountPrice)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;