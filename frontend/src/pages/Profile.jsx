import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
    const [selectedTab, setSelectedTab] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null); // user details
    const { backendUrl } = useContext(ShopContext)
    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${backendUrl}/api/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setUserInfo(res.data.user);
                }
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };
        fetchUser();
    }, []);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 md:flex mt-22">
            {/* Sidebar Toggle (Mobile) */}
            <div className="md:hidden p-4 bg-white flex justify-between items-center">
                <h2 className="text-lg font-semibold">My Account</h2>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-blue-600 font-medium">
                    {isSidebarOpen ? 'Close' : 'Menu'}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`bg-white p-6 w-full md:w-64 z-10 md:block ${isSidebarOpen ? 'block' : 'hidden'} md:static absolute`}>
                <h2 className="text-xl font-bold mb-6">My Account</h2>
                <ul className="space-y-4">
                    {[
                        { tab: 'profile', label: '👤 Profile Info' },
                        { tab: 'orders', label: '📦 Order History' },
                        { tab: 'wishlist', label: '❤️ Wishlist' },
                        { tab: 'address', label: '🏠 Address Book' },
                        { tab: 'payment', label: '💳 Payment Methods' },
                        { tab: 'rewards', label: '🎁 Rewards' },
                    ].map(({ tab, label }) => (
                        <li key={tab}>
                            <button
                                onClick={() => handleTabClick(tab)}
                                className={`w-full text-left ${selectedTab === tab ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                            >
                                {label}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button className="text-red-500 hover:underline w-full text-left">🚪 Logout</button>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to Your Trends Wear Profile</h1>
                <p className="text-gray-600 mb-6">Manage your details, orders, and preferences — all in one place.</p>

                {selectedTab === 'profile' && (
                    <Section title="👤 Personal Information">
                        {userInfo ? (
                            <>
                                <p><strong>Name:</strong> {userInfo.name}</p>
                                <p><strong>Email:</strong> {userInfo.email}</p>
                                <p><strong>Phone:</strong> {userInfo.phone || 'Not Provided'}</p>
                                <button className="mt-2 text-blue-600 hover:underline">Edit Profile</button>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </Section>
                )}

                {/* Other static sections remain same (you can make them dynamic later) */}
                {selectedTab === 'orders' && (
                    <Section title="📦 Order History">
                        <p><strong>Order ID:</strong> #TW1024</p>
                        <p><strong>Date:</strong> 12 July 2025</p>
                        <p><strong>Status:</strong> Delivered</p>
                        <p><strong>Total:</strong> ₹2,199</p>
                        <button className="mt-2 text-blue-600 hover:underline">View Details</button>
                    </Section>
                )}

                {selectedTab === 'wishlist' && (
                    <Section title="❤️ Saved Items">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <p><strong>Men’s Slim Fit Denim Jacket</strong></p>
                                <p className="text-gray-600">₹1,999</p>
                            </div>
                            <div className="space-x-3">
                                <button className="text-green-600 hover:underline">Add to Cart</button>
                                <button className="text-red-500 hover:underline">Remove</button>
                            </div>
                        </div>
                    </Section>
                )}

                {selectedTab === 'address' && (
                    <Section title="🏠 Address Book">
                        <p>25, MG Road, Chennai, TN – 600001</p>
                        <div className="space-x-4 mt-2">
                            <button className="text-blue-600 hover:underline">Edit</button>
                            <button className="text-red-500 hover:underline">Delete</button>
                        </div>
                    </Section>
                )}

                {selectedTab === 'payment' && (
                    <Section title="💳 Payment Methods">
                        <p>Visa **** **** **** 3456</p>
                        <button className="mt-2 text-red-500 hover:underline">Remove</button>
                    </Section>
                )}

                {selectedTab === 'rewards' && (
                    <Section title="🎁 My Rewards">
                        <p><strong>Total Points:</strong> 180</p>
                        <p><strong>Next reward in:</strong> 120 points</p>
                    </Section>
                )}
            </main>
        </div>
    );
};

// Reusable Section
const Section = ({ title, children }) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {children}
    </div>
);

export default Profile;
