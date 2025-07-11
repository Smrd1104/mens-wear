// Invoice.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App'

const Invoice = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/order/invoice/view/${orderId}`)
                if (res.data.success) {
                    setOrder(res.data.order)
                }
            } catch (err) {
                console.error('Failed to load invoice:', err)
            }
        }

        fetchInvoice()
    }, [orderId])

    if (!order) return <div className="p-4">Loading invoice...</div>

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Invoice</h2>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <hr className="my-4" />
            <h3 className="text-lg font-semibold">Items:</h3>
            <ul className="mt-2 space-y-2">
                {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between border-b py-1">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.price * item.quantity}</span>
                    </li>
                ))}
            </ul>
            <hr className="my-4" />
            <p className="text-right text-lg font-bold">Total: ₹{order.amount}</p>
        </div>
    )
}

export default Invoice
