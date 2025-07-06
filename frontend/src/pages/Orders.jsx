import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import axios from 'axios'
const Orders = () => {

    const { backendUrl, token, currency } = useContext(ShopContext)

    const [orderData, setOrderData] = useState([])

    const [visibleOrders, setVisibleOrders] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(5); // initial number of items to show





    const loadOrderData = async () => {
        try {

            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + "/api/order/userorders", { userId: localStorage.getItem("userId") }, { headers: { token } })

            if (response.data.success) {
                let allOrderItem = [];
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date
                        allOrderItem.push(item)
                    })

                })

                setOrderData(allOrderItem)
                setVisibleOrders(allOrderItem.slice(0, itemsToShow));

            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setVisibleOrders(orderData.slice(0, itemsToShow));
    }, [itemsToShow, orderData]);


    useEffect(() => {
        loadOrderData()
    }, [token])

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'my'} text2={'orders'} />
            </div>

            <div>
                {
                    visibleOrders.map((item, index) => (
                        <div key={index} className='py-4 border-t border-b border-gray-500 text-gray-700 flex flex-col md:flex-row md:justify-between gap-4'>
                            <div className='flex items-start gap-6 text-sm'>
                                <img src={item.image[0]} alt='' className='w-16 sm:w-20' />
                                <div>
                                    <p className='sm:text-base font-medium'>{item.name}</p>
                                    <div className='flex item-center gap-3 mt-1 text-base text-gray-700'>
                                        <p className='text-md'>{currency}{item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                    </div>
                                    <p className='mt-2'>Date:<span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                    <p className='mt-2'>Payment:<span className='text-gray-400'>{item.paymentMethod}</span></p>

                                </div>
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="capitalize text-base md:text-sm">{item.status}</p>
                                </div>

                                {/* Track Button */}
                                <button
                                    className="border px-4 py-2 text-sm font-medium rounded-sm w-fit"

                                >
                                    Track Order
                                </button>

                            </div>

                        </div>
                    ))
                }
            </div>

            {
                itemsToShow < orderData.length && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setItemsToShow(prev => prev + 5)}
                            className="px-6 py-2 border border-black  cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300"
                        >
                            Load More
                        </button>
                    </div>
                )
            }

        </div>
    )
}

export default Orders