import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import { assets } from '../assets/frontend_assets/assets'
import CartTotal from '../components/CartTotal'
import cart from "../assets/cart.png"

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  // Map of hex codes to color names
  const colorNames = {
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#FF0000': 'Red',
    '#0000FF': 'Blue',
    '#00FF00': 'Green',
    // Add more colors as needed
  }

  useEffect(() => {
    if (products.length > 0) {
      const tempData = []
      for (const productId in cartItems) {
        for (const variantKey in cartItems[productId]) {
          if (cartItems[productId][variantKey] > 0) {
            // Split variantKey into size and color
            const [size, color] = variantKey.split('|')
            tempData.push({
              _id: productId,
              size,
              color,
              quantity: cartItems[productId][variantKey]
            })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  const getColorName = (hexCode) => {
    return colorNames[hexCode] || hexCode // Fallback to hex code if name not found
  }

  return (
    <div className='border-t pt-22'>
      <div className='text-2xl mb-3'>
        <Title text1={"your"} text2={"cart"} />
      </div>

      {/* If cart is empty */}
      {cartData.length === 0 ? (
        <div className='text-center my-20'>
          <img src={cart} alt="Empty Cart" className='mx-auto w-20 sm:w-[200px] mb-6' />
          <p className='text-lg font-semibold mb-4 text-gray-600'>Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className='bg-black text-white px-6 py-2 text-sm uppercase rounded'
          >
            Go to Shopping
          </button>
        </div>
      ) : (
        <>
          <div>
            {cartData.map((item, index) => {
              const productData = products.find(product => product._id === item._id)
              if (!productData) return null

              return (
                <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <img src={productData.image[0]} alt='' className='w-16 sm:w-20' />
                    <div>
                      <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                      <div className='flex items-center gap-3 mt-2 flex-wrap'>
                        <p>{currency}{productData.price}</p>
                        {item.size && (
                          <p className='px-2 sm:px-3 py-0.5 border bg-slate-50 text-xs'>
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <div className='flex items-center gap-1 px-2 sm:px-3 py-0.5 border bg-slate-50 text-xs '>

                            Color:

                            <div
                              className='w-3 h-3 rounded-full border'
                              style={{ backgroundColor: item.color }}
                              title={getColorName(item.color)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <input
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (value >= 1) {
                        // Reconstruct the variant key for update
                        const variantKey = `${item.size}|${item.color}`
                        updateQuantity(item._id, variantKey, value)
                      }
                    }}
                    type='number'
                    min={1}
                    defaultValue={item.quantity}
                    className='w-12 sm:w-16 px-1 sm:px-2 py-1 border rounded text-sm'
                  />

                  <img
                    onClick={() => {
                      const variantKey = `${item.size}|${item.color}`
                      updateQuantity(item._id, variantKey, 0)
                    }}
                    src={assets.bin_icon}
                    alt='Delete'
                    className='w-4 mr-4 sm:w-5 cursor-pointer'
                  />
                </div>
              )
            })}
          </div>

          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <div className='w-full text-end'>
                <button
                  onClick={() => navigate('/place-order')}
                  className='uppercase bg-black text-white text-sm my-8 px-8 py-3'
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart