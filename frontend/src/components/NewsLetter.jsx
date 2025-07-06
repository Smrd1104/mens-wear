import React, { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from "../context/ShopContext"

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);

    const { backendUrl } = useContext(ShopContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(backendUrl + '/api/subscribe', { email });

            setMessage({ type: 'success', text: response.data.message });
            setEmail('');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <div className="text-center py-12">
            <p className="text-2xl font-medium text-gray-800">Subscribe now & get 20% offer</p>
            <p className="text-gray-400 mt-3">
                Be the first to know about new arrivals, exclusive deals, and fashion tips. Join our community today!
            </p>

            <form
                onSubmit={onSubmitHandler}
                className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
            >
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:flex-1 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-black text-white text-xs px-10 py-4 uppercase cursor-pointer"
                >
                    Subscribe
                </button>
            </form>

            {message && (
                <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default NewsLetter;
