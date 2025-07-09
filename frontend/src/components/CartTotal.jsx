import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from "../components/Title"

const CartTotal = () => {

    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)
    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'cart'} text2={'totals'} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Sub Total</p>
                    <p>
                        {currency}
                        {Number(getCartAmount() || 0).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping fee</p>
                    <p>
                        {currency}
                        {Number(delivery_fee || 0).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Total</p>
                    <p>
                        {currency}
                        {Number(
                            getCartAmount() === 0 ? 0 : getCartAmount() + (delivery_fee || 0)
                        ).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal