import React, { useEffect, useState } from 'react'
import { backendUrl } from "../App"
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/admin_assets/assets'

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [colorMap, setColorMap] = useState({}) // Store color mappings
    const ordersPerPage = 5
    const statusOptions = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled']

    // Fetch color mappings from backend
    const fetchColorMappings = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/colors`)
            if (response.data.success) {
                setColorMap(response.data.colors)
            }
        } catch (error) {
            console.error("Error fetching color mappings:", error)
            // Fallback to default colors if API fails
            setColorMap({
                '#25ad10': 'white',
                '#000000': 'Black',
                '#FFFFFF': 'White',
                '#FF0000': 'Red',
                '#0000FF': 'Blue',
                '#00FF00': 'Green'
            })
        }
    }

    const getColorName = (hexColor) => {
        if (!hexColor) return ''
        const cleanHex = hexColor.replace('|', '').toUpperCase()
        return colorMap[cleanHex] || cleanHex
    }

    const extractSizeAndColor = (variantString) => {
        if (!variantString) return { size: '', color: '' }

        const parts = variantString.split('|')
        if (parts.length === 1) return { size: parts[0], color: '' }

        return {
            size: parts[0],
            color: getColorName(parts[1]),
            hexColor: parts[1]
        }
    }

    const fetchAllOrders = async () => {
        if (!token) {
            setLoading(false)
            return
        }

        try {
            const response = await axios.post(
                backendUrl + "/api/order/list",
                {},
                { headers: { token } }
            )
            if (response.data.success) {
                // Process orders to extract color information
                const processedOrders = response.data.orders.map(order => ({
                    ...order,
                    items: order.items.map(item => ({
                        ...item,
                        variantInfo: extractSizeAndColor(item.size)
                    }))
                }))
                setOrders(processedOrders || [])
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/order/status",
                { orderId, status: newStatus },
                { headers: { token } }
            )

            if (response.data.success) {
                toast.success(`Order status updated to ${newStatus}`)
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ))
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchColorMappings()
        fetchAllOrders()
    }, [token])

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading orders...</div>
    }

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Order Management</h3>

            <div className="space-y-4">
                {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                        <div
                            key={order._id}
                            className="border p-4 rounded-lg flex flex-col md:flex-row items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex-shrink-0">
                                <img src={assets.parcel_icon} alt="Parcel" className="w-10 h-10" />
                            </div>

                            <div className="flex-1 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="font-semibold text-sm md:text-base">Order ID:</p>
                                        <p className="text-xs md:text-sm text-gray-600 break-all">{order._id}</p>
                                    </div>

                                    <div className="">
                                        <p className="font-semibold text-sm md:text-base">Amount:</p>
                                        <p className="text-sm md:text-base font-medium">
                                            ₹{order.amount?.toFixed(2)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-sm md:text-base">Date & Payment Details:</p>
                                        <p className="text-xs md:text-sm text-gray-600">
                                            {new Date(order.date).toUTCString()}
                                        </p>
                                        <div>
                                            <p className="text-xs md:text-sm text-gray-600">Method: {order.paymentMethod}</p>
                                            <p className="text-xs md:text-sm text-gray-600">Payment: {order.payment ? "Done" : "Pending"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
                                    <div className='flex flex-col'>
                                        <h4 className="font-medium text-sm md:text-base">Items: {order.items.length}</h4>
                                        <div className="mt-1">
                                            {order.items?.map((item) => (
                                                <div
                                                    key={`${order._id}-${item._id || item.name}`}
                                                    className="flex items-start mb-2"
                                                >
                                                    <span className="text-xs md:text-sm bg-gray-100 rounded-full px-2 py-1 mr-2">
                                                        {item.quantity}x
                                                    </span>
                                                    <div>
                                                        <p className="text-xs md:text-sm">{item.name}</p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {item.variantInfo.size && (
                                                                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                                    Size: {item.variantInfo.size}
                                                                </p>
                                                            )}
                                                            {item.variantInfo.color && (
                                                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                                    {/* Color: {item.variantInfo.color} */} Color:
                                                                    <div
                                                                        className="w-3 h-3 rounded-full border"
                                                                        style={{ backgroundColor: item.variantInfo.hexColor }}
                                                                        title={item.variantInfo.color}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-sm md:text-base">Customer Address:</h4>
                                        <p className="text-xs md:text-sm text-gray-600 capitalize">
                                            {order.address?.firstName || 'Guest'} {order.address?.lastName || 'Guest'}
                                        </p>
                                        <div className="text-xs md:text-sm text-gray-600 mt-1 space-y-0.5">
                                            <p>{order.address?.street}</p>
                                            <p>{order.address?.city}, {order.address?.state}</p>
                                            <p>{order.address?.country}, {order.address?.zipcode}</p>
                                            <p>📞 {order.address?.phone}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-5'>
                                        <div>
                                            <p className="font-semibold text-sm md:text-base">Status:</p>
                                            <select
                                                value={order.status || 'Order Placed'}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className={`text-xs md:text-sm p-1 rounded border
                                                ${order.status === 'Delivered' ? 'text-green-600 border-green-200 bg-green-50' :
                                                        order.status === 'Cancelled' ? 'text-red-600 border-red-200 bg-red-50' :
                                                            order.status === 'Out for Delivery' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                                                                'text-yellow-600 border-yellow-200 bg-yellow-50'
                                                    }`}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option} value={option} className="bg-white">
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <img
                            src={assets.empty_order_icon}
                            alt="No orders"
                            className="w-24 h-24 opacity-70 mb-4"
                        />
                        <p className="text-gray-500">No orders found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {orders.length > ordersPerPage && (
                <div className="flex justify-center mt-6">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium 
                                    ${currentPage === index + 1
                                        ? 'bg-blue-50 text-blue-600 border-blue-500'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() =>
                                paginate(currentPage < Math.ceil(orders.length / ordersPerPage) ? currentPage + 1 : currentPage)
                            }
                            disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
                            className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    )
}

export default Orders