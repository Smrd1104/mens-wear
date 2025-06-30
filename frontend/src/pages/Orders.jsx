import React, { useContext } from 'react'
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
const Orders = () => {

    const { products, currency } = useContext(ShopContext)

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'my'} text2={'orders'} />
            </div>

            <div>
                {
                    products.slice(1, 4).map((item, index) => (
                        <div key={index} className='py-4 border-t border-b border-gray-500 text-gray-700 flex flex-col md:flex-row md:justify-between gap-4'>
                            <div className='flex items-start gap-6 text-sm'>
                                <img src={item.image[0]} alt='' className='w-16 sm:w-20' />
                                <div>
                                    <p className='sm:text-base font-medium'>{item.name}</p>
                                    <div className='flex item-center gap-3 mt-2 text-base text-gray-700'>
                                        <p className='text-lg'>{currency}{item.price}</p>
                                        <p>Quantity: 1</p>
                                        <p>Size: M</p>
                                    </div>
                                    <p className='mt-2'>Date:<span className='text-gray-400'> 25, Jul, 2025</span></p>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="capitalize text-base md:text-sm">ready to ship</p>
                                </div>

                                {/* Track Button */}
                                <button className="border px-4 py-2 text-sm font-medium rounded-sm w-fit">
                                    Track Order
                                </button>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Orders