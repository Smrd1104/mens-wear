import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const ReviewSection = ({ productId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    username: "",
    rating: 5,
    comment: "",
  });

  const { backendUrl } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/reviews`, {
        ...form,
        productId,
      });
      setForm({ username: "", rating: 5, comment: "" });

      if (onSuccess) onSuccess(); // ✅ trigger parent to refetch reviews
      if (onClose) onClose();     // ✅ close popup
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
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
          onChange={(e) =>
            setForm({ ...form, rating: Number(e.target.value) })
          }
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
