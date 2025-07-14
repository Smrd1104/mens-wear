import { useEffect, useState } from "react";
import axios from "axios";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    username: "",
    rating: 5,
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/${productId}`);
      if (Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        setReviews([]);
        console.warn("Unexpected data format from reviews API:", res.data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/reviews", {
        ...form,
        productId,
      });
      setForm({ username: "", rating: 5, comment: "" });
      fetchReviews(); // refresh
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review, idx) => (
          <div key={idx} className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{review.username}</span>
              <span className="text-yellow-600">{review.rating} ⭐</span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <h3 className="text-md font-semibold">Write a Review</h3>

        <input
          type="text"
          placeholder="Your name"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />

        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          required
        >
          {[5, 4, 3, 2, 1].map((val) => (
            <option key={val} value={val}>
              {val} Star{val > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <textarea
          rows={4}
          placeholder="Your review..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;
