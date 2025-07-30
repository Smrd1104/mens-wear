import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { calculateRewardPoints } from '../utils/rewards'; // 🔁 Add import

const Profile = () => {







    const [selectedTab, setSelectedTab] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null); // user details
    const { backendUrl, token, navigate, setToken, setCartItems } = useContext(ShopContext)
    const [orderHistory, setOrderHistory] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5);

    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });
    const [showAddressForm, setShowAddressForm] = useState(false);


    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/user/addresses`, { headers: {
    Authorization: `Bearer ${token}`,
  }});
                if (res.data.success) setAddresses(res.data.addresses);
            } catch (err) {
                console.error("Failed to fetch addresses", err);
            }
        };

        if (selectedTab === 'address') {
            fetchAddresses();
        }
    }, [selectedTab]);


    const handleAddAddress = async () => {
        try {
            const res = await axios.post(`${backendUrl}/api/user/addresses`, newAddress,{ headers: {
    Authorization: `Bearer ${token}`,
  }});
            if (res.data.success) {
                setAddresses(res.data.addresses);
                setNewAddress({
                    firstName: "", lastName: "", phone: "",
                    street: "", city: "", state: "", zip: "", country: ""
                });
                setShowAddressForm(false);
            }
        } catch (err) {
            console.error("Error adding address", err);
        }
    };


    const handleDeleteAddress = async (index) => {
        try {
            const res = await axios.delete(`${backendUrl}/api/user/addresses/${index}`,{ headers: {
    Authorization: `Bearer ${token}`,
  }});
            if (res.data.success) {
                setAddresses(res.data.addresses);
            }
        } catch (err) {
            console.error("Error deleting address", err);
        }
    };


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


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.post(
                    `${backendUrl}/api/order/userorders`,
                    { userId: localStorage.getItem('userId') },
                   { headers: {
    Authorization: `Bearer ${token}`,
  }}
                );
                if (res.data.success) {
                    setOrderHistory(res.data.orders);
                }
            } catch (err) {
                console.error("Failed to fetch order history", err);
            }
        };

        fetchOrders();
    }, []);


    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setIsSidebarOpen(false);
    };

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token', token)
        setToken('')
        setCartItems({})

    }



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
                        <button onClick={logout} className="text-red-500 hover:underline w-full text-left">🚪 Logout</button>
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
                        {orderHistory.length === 0 ? (
                            <p className="text-gray-500">You have no orders yet.</p>
                        ) : (
                            <>
                                {orderHistory.slice(0, itemsToShow).map((order) => (
                                    <div
                                        key={order._id}
                                        className="border-t py-4 mb-4 text-sm sm:text-base"
                                    >
                                        <p><strong>Order ID:</strong> {order._id}</p>
                                        <p><strong>Date:</strong> {new Date(order.date).toDateString()}</p>
                                        <p><strong>Status:</strong> {order.status}</p>
                                        <p><strong>Payment:</strong> {order.paymentMethod}</p>
                                        <p>
                                            <strong>Total Items:</strong>{' '}
                                            {order.items?.reduce((sum, item) => sum + item.quantity, 0)}
                                        </p>
                                        <button
                                            className="mt-2 text-blue-600 hover:underline"
                                            onClick={() => window.location.href = `/orders?orderId=${order._id}`}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}

                                {itemsToShow < orderHistory.length && (
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={() => setItemsToShow((prev) => prev + 5)}
                                            className="px-6 py-2 border border-black cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
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
                        {addresses.length === 0 ? (
                            <p className="text-gray-500">No addresses added yet.</p>
                        ) : (
                            addresses.map((addr, index) => (
                                <div key={index} className="border p-4 rounded-lg mb-4">
                                    <p><strong>Name:</strong> {addr.firstName} {addr.lastName}</p>
                                    <p><strong>Phone:</strong> {addr.phone}</p>
                                    <p><strong>Street:</strong> {addr.street}</p>
                                    <p><strong>City:</strong> {addr.city}</p>
                                    <p><strong>State:</strong> {addr.state}</p>
                                    <p><strong>ZIP:</strong> {addr.zip}</p>
                                    <p><strong>Country:</strong> {addr.country}</p>
                                    <button
                                        onClick={() => handleDeleteAddress(index)}
                                        className="text-red-600 mt-2 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}

                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            {showAddressForm ? "Cancel" : "➕ Add New Address"}
                        </button>

                        {showAddressForm && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: "firstName", label: "First Name" },
                                    { name: "lastName", label: "Last Name" },
                                    { name: "phone", label: "Phone" },
                                    { name: "street", label: "Street Address" },
                                    { name: "city", label: "City" },
                                    { name: "state", label: "State" },
                                    { name: "zip", label: "ZIP Code" },
                                    { name: "country", label: "Country" },
                                ].map(({ name, label }) => (
                                    <input
                                        key={name}
                                        type="text"
                                        name={name}
                                        value={newAddress[name]}
                                        onChange={(e) => setNewAddress({ ...newAddress, [name]: e.target.value })}
                                        placeholder={label}
                                        className="border p-2 rounded"
                                    />
                                ))}
                                <div className="col-span-full">
                                    <button
                                        onClick={handleAddAddress}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </div>
                        )}
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
                        <p><strong>Total Points:</strong> {calculateRewardPoints(orderHistory)}</p>
                        <p><strong>Next reward in:</strong> {100 - (calculateRewardPoints(orderHistory) % 100)} points</p>
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
