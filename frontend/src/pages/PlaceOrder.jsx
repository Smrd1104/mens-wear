import { useContext, useState } from "react"
import { assets } from "../assets/frontend_assets/assets"
import CartTotal from "../components/CartTotal"
import Title from "../components/Title"
import { ShopContext } from "../context/ShopContext"
import axios from "axios"
import { toast } from "react-toastify"
const PlaceOrder = () => {

    const [method, setMethod] = useState('cod')

    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',

    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value

        setFormData(data => ({ ...data, [name]: value }))
    }


    const onSubmitHandler = async (event, item) => {

        event.preventDefault();

        try {

            let orderItems = [];

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }

            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee



            }

            switch (method) {

                // api call from cod

                case 'cod':

                    const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } })



                    if (response.data.success) {
                        setCartItems({})
                        navigate("/orders")
                    } else {
                        toast.error(response.data.message)
                    }

                    break;

                default:
                    break;
            }



            console.log(orderItems)

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* --------left side-------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'delivery'} text2={'information'} />
                </div>
                <div className="flex gap-3">
                    <input name="firstName" required onChange={onChangeHandler} value={formData.firstName} type="text" placeholder="First Name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                    <input name="lastName" required onChange={onChangeHandler} value={formData.lastName} type="text" placeholder="Last Name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                </div>
                <input name="email" required onChange={onChangeHandler} value={formData.email} type="email" placeholder="Email Address" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                <input name="street" required onChange={onChangeHandler} value={formData.street} type="text" placeholder="Street" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                <div className="flex gap-3">
                    <input name="city" required onChange={onChangeHandler} value={formData.city} type="text" placeholder="City" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                    <input name="state" required onChange={onChangeHandler} value={formData.state} type="text" placeholder="State" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                </div>
                <div className="flex gap-3">
                    <input name="zipcode" required onChange={onChangeHandler} value={formData.zipcode} type="number" placeholder="Zipcode" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                    <input name="country" required onChange={onChangeHandler} value={formData.country} type="text" placeholder="Country" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
                </div>
                <input name="phone" required onChange={onChangeHandler} value={formData.phone} type="number" placeholder="Phone/Mobile Number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
            </div>

            {/* right side content  */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div>
                    <Title text1={'payment'} text2={'methods'} />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border px-3  p-2 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? "bg-green-400" : ""}`}></p>
                            <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border px-3  p-2 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? "bg-green-400" : ""}`}></p>
                            <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
                        </div>
                        <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border px-3  p-2 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? "bg-green-400" : ""}`}></p>
                            <p className="uppercase text-gray-400 font-medium mx-4">cash on delivery</p>
                        </div>

                    </div>

                    <div className="w-full text-end mt-8">
                        <button type="submit" className="uppercase bg-black text-white px-16 py-3 text-sm ">place order</button>
                    </div>
                </div>
            </div>

        </form>
    )
}

export default PlaceOrder