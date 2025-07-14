import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/reviews/all`);
                setReviews(res.data || []);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchAllReviews();
    }, [backendUrl]);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.25 && rating - fullStars <= 0.75;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
        }

        if (hasHalf && stars.length < 5) {
            stars.push(<span key="half" className="text-yellow-500">⭑</span>); // fallback half
        }

        while (stars.length < 5) {
            stars.push(<span key={`empty-${stars.length}`} className="text-gray-300">☆</span>);
        }

        return stars;
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6">All Product Reviews</h2>

            {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews available.</p>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="border rounded-md p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">{review.username}</span>
                                <div className="text-sm">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-gray-600 mb-1">{review.comment}</p>
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
