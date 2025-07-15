import React, { useState } from 'react';

const Profile = () => {
    const [selectedTab, setSelectedTab] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // for mobile

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setIsSidebarOpen(false); // close sidebar on mobile after selection
    };

    return (
        <div className="min-h-screen bg-gray-100 md:flex mt-22">
            {/* Sidebar - Mobile Toggle */}
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
                    <li>
                        <button
                            onClick={() => handleTabClick('profile')}
                            className={`w-full text-left ${selectedTab === 'profile' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                        >
                            👤 Profile Info
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleTabClick('orders')}
                            className={`w-full text-left ${selectedTab === 'orders' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                        >
                            📦 Order History
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleTabClick('wishlist')}
                            className={`w-full text-left ${selectedTab === 'wishlist' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                        >
                            ❤️ Wishlist
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleTabClick('address')}
                            className={`w-full text-left ${selectedTab === 'address' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                        >
                            🏠 Address Book
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleTabClick('payment')}
                            className={`w-full text-left ${selectedTab === 'payment' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                        >
                            💳 Payment Methods
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleTabClick('rewards')}
                            className={`w-full text-left ${selectedTab === 'rewards' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                        >
                            🎁 Rewards
                        </button>
                    </li>
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
                        <p><strong>Name:</strong> John Doe</p>
                        <p><strong>Email:</strong> johndoe@example.com</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                        <button className="mt-2 text-blue-600 hover:underline">Edit Profile</button>
                    </Section>
                )}

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

// Reusable section component
const Section = ({ title, children }) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {children}
    </div>
);

export default Profile;
