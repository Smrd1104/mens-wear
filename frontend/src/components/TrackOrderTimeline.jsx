import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const TrackOrderTimeline = ({ orderId, onClose }) => {
    const [tracking, setTracking] = useState([]);

    const { backendUrl, token } = useContext(ShopContext)

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                console.log("🔍 Sending orderId:", orderId); // ADD THIS
                const res = await axios.post(
                    `${backendUrl}/api/order/track`,
                    { orderId: "6865661d7a455d076f66de96" },
                    { headers: { token } }
                );

                if (res.data.success) {
                    setTracking(res.data.tracking.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
                } else {
                    console.log("❗ Response:", res.data);
                }
            } catch (err) {
                console.error("🚨 Axios error:", err);
            }
        };

        fetchTracking();
    }, [orderId]);


    return (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white max-w-md w-full rounded-lg p-6 relative overflow-y-auto max-h-[80vh]">
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl">&times;</button>
                <h2 className="text-xl font-semibold mb-4">Tracking Order</h2>

                <div className="border-l-2 border-green-500 pl-4">
                    {tracking.map((item, index) => (
                        <div key={index} className="mb-6 relative">
                            <div className="absolute -left-4 top-1 text-green-600">
                                <FaCheckCircle size={20} />
                            </div>
                            <p className="font-medium">{item.status}</p>
                            <p className="text-sm text-gray-500">{item.message}</p>
                            <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrackOrderTimeline;
