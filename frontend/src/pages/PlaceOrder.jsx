import { useContext, useEffect, useMemo, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import whatsapp_logo from "../assets/frontend_assets/whatsapp(1).png";

const PlaceOrder = () => {
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    productId,
    fetchSKUs,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(p._id, p));
    return map;
  }, [products]);

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          toast.error("Payment verification failed.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!method) {
      return toast.error("Please select a payment method.");
    }

    try {
      setLoading(true);

      const orderItems = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const product = productMap.get(productId);
            if (product) {
              const quantity = cartItems[productId][size];
              orderItems.push({
                productId: product._id,
                name: product.name,
                size,
                color: product.color?.name || "default",
                price: product.price,
                quantity,
                image: product.image || [],
              });
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: Math.round(getCartAmount() + delivery_fee),
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token } }
          );

          if (response.data.success) {
            setCartItems({});
            localStorage.setItem(
              "refreshProductId",
              JSON.stringify(orderItems.map((item) => item.productId))
            );
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "razorpay": {
          const responseRazorpay = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;
        }

        case "whatsapp": {
          const message = `
🛒 *Order Summary* 🛒

👤 Name: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}

📦 Products:
${orderItems
  .map((item) => `- ${item.name} (Size: ${item.size}) x${item.quantity}`)
  .join("\n")}

🏠 Address:
${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipcode}, ${formData.country}

💰 Total: ₹${Math.round(getCartAmount() + delivery_fee)}

*Please confirm this order.*`;

          const encodedMessage = encodeURIComponent(message);
          const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919360103180";
          const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

          await axios.post(
            `${backendUrl}/api/order/whatsapp`,
            orderData,
            { headers: { token } }
          );

          window.open(whatsappUrl, "_blank");
          break;
        }

        default:
          toast.error("Invalid payment method.");
          break;
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSKUs = async () => {
      const response = await axios.get(`${backendUrl}/api/sku/${productId}`);
      if (response.data.success) {
        fetchSKUs(); // Assuming this will update SKU list
      }
    };

    const refreshIds = JSON.parse(localStorage.getItem("refreshProductId") || "[]");
    if (refreshIds.includes(productId)) {
      loadSKUs();
      localStorage.setItem(
        "refreshProductId",
        JSON.stringify(refreshIds.filter((id) => id !== productId))
      );
    }
  }, [productId]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-22 sm:pt-22 min-h-[80vh] border-t"
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="delivery" text2="information" />
        </div>
        <div className="flex gap-3">
          <input
            name="firstName"
            required
            onChange={onChangeHandler}
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            name="lastName"
            required
            onChange={onChangeHandler}
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          name="email"
          required
          onChange={onChangeHandler}
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          name="street"
          required
          onChange={onChangeHandler}
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            name="city"
            required
            onChange={onChangeHandler}
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            name="state"
            required
            onChange={onChangeHandler}
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            name="zipcode"
            required
            onChange={onChangeHandler}
            value={formData.zipcode}
            type="number"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            name="country"
            required
            onChange={onChangeHandler}
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          name="phone"
          required
          onChange={onChangeHandler}
          value={formData.phone}
          type="tel"
          placeholder="Phone/Mobile Number"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* RIGHT SIDE */}
      <div>
        <div className="my-3 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-3">
          <div className="text-2xl">
            <Title text1="payment" text2="methods" />
          </div>
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border px-3 p-2 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} alt="razorpay" className="h-5 mx-4" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border px-3 p-2 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="uppercase text-gray-400 font-medium mx-4">cash on delivery</p>
            </div>
            <div
              onClick={() => setMethod("whatsapp")}
              className="flex items-center gap-3 border px-3 p-2 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "whatsapp" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={whatsapp_logo} alt="whatsapp" className="min-w-3.5 h-5 mx-4" />
              <p className="uppercase text-gray-400 font-medium -translate-x-4.5">
                WhatsApp
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="uppercase bg-black text-white px-16 py-3 text-sm"
            >
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;










// import { useContext, useState } from "react"
// import { assets } from "../assets/frontend_assets/assets"
// import CartTotal from "../components/CartTotal"
// import Title from "../components/Title"
// import { ShopContext } from "../context/ShopContext"
// import axios from "axios"
// import { toast } from "react-toastify"
// import whatsapp_logo from '../assets/frontend_assets/whatsapp(1).png'


// const PlaceOrder = () => {

//     const [method, setMethod] = useState('')

//     const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)


//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         street: '',
//         city: '',
//         state: '',
//         zipcode: '',
//         country: '',
//         phone: '',

//     })

//     const onChangeHandler = (event) => {
//         const name = event.target.name
//         const value = event.target.value

//         setFormData(data => ({ ...data, [name]: value }))
//     }


//     const initPay = (order) => {
//         const options = {
//             key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//             amount: order.amount,
//             currency: order.currency,
//             name: "Order Payment",
//             description: "Order Payment",
//             order_id: order.id,
//             receipt: order.receipt,
//             handler: async (response) => {
//                 console.log(response);
//                 try {
//                     const { data } = await axios.post(
//                         backendUrl + "/api/order/verifyRazorpay",
//                         response,
//                         {
//                             headers: { token },
//                         }
//                     );
//                     if (data.success) {

//                         navigate('/orders')
//                         setCartItems({})
//                         // Payment verified successfully
//                         console.log("Payment verified");
//                         // Optionally: redirect user or show success toast
//                     } else {
//                         // Handle verification failure
//                         console.log("Payment verification failed");
//                     }
//                 } catch (error) {
//                     console.log("Error verifying payment:", error);
//                     toast.error(error)
//                 }
//             },

//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//     };



//     const onSubmitHandler = async (event, item) => {

//         event.preventDefault();

//         try {

//             let orderItems = [];

//             for (const items in cartItems) {
//                 for (const item in cartItems[items]) {
//                     if (cartItems[items][item] > 0) {
//                         const itemInfo = structuredClone(products.find(product => product._id === items))
//                         if (itemInfo) {
//                             itemInfo.size = item
//                             itemInfo.quantity = cartItems[items][item]
//                             orderItems.push(itemInfo)
//                         }
//                     }
//                 }

//             }

//             let orderData = {
//                 address: formData,
//                 items: orderItems,
//                 amount: Math.round(getCartAmount() + delivery_fee)



//             }

//             switch (method) {

//                 // api call from cod

//                 case 'cod':

//                     const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } })



//                     if (response.data.success) {
//                         setCartItems({})
//                         navigate("/orders")
//                     } else {
//                         toast.error(response.data.message)
//                     }

//                     break;





//                 case "razorpay":

//                     const responseRazorpay = await axios.post(backendUrl + "/api/order/razorpay", orderData, { headers: { token } })

//                     if (responseRazorpay.data.success) {
//                         initPay(responseRazorpay.data.order)
//                     }

//                     break;




//                 default:
//                     break;


//                 // whatsapp
//                 case 'whatsapp': {
//                     // Format the WhatsApp message
//                     const message = `
// 🛒 *Order Summary* 🛒

// 👤 Name: ${formData.firstName} ${formData.lastName}
// 📧 Email: ${formData.email}
// 📱 Phone: ${formData.phone}

// 📦 Products:
// ${orderItems.map(item => `- ${item.name} (Size: ${item.size}) x${item.quantity}`).join('\n')}

// 🏠 Address:
// ${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipcode}, ${formData.country}

// 💰 Total: ₹${Math.round(getCartAmount() + delivery_fee)}

// *Please confirm this order.*
//   `;

//                     // Encode the message for URL
//                     const encodedMessage = encodeURIComponent(message);

//                     // Replace with your actual WhatsApp business number (with country code, no "+" or "-")
//                     const whatsappNumber = '919360103180';

//                     // Create WhatsApp URL
//                     const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

//                     // Optionally: log order to your backend
//                     await axios.post(`${backendUrl}/api/order/whatsapp`, {
//                         address: formData,
//                         items: orderItems,
//                         amount: Math.round(getCartAmount() + delivery_fee),
//                     }, {
//                         headers: { token },
//                     });

//                     // Open WhatsApp chat in new tab
//                     window.open(whatsappUrl, '_blank');

//                     break;
//                 }

//             }



//             console.log(orderItems)

//         } catch (error) {
//             console.log(error)
//         }

//     }

//     return (
//         <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-22 sm:pt-22 min-h-[80vh] border-t'>
//             {/* --------left side-------- */}
//             <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
//                 <div className='text-xl sm:text-2xl my-3'>
//                     <Title text1={'delivery'} text2={'information'} />
//                 </div>
//                 <div className="flex gap-3">
//                     <input name="firstName" required onChange={onChangeHandler} value={formData.firstName} type="text" placeholder="First Name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                     <input name="lastName" required onChange={onChangeHandler} value={formData.lastName} type="text" placeholder="Last Name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                 </div>
//                 <input name="email" required onChange={onChangeHandler} value={formData.email} type="email" placeholder="Email Address" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                 <input name="street" required onChange={onChangeHandler} value={formData.street} type="text" placeholder="Street" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                 <div className="flex gap-3">
//                     <input name="city" required onChange={onChangeHandler} value={formData.city} type="text" placeholder="City" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                     <input name="state" required onChange={onChangeHandler} value={formData.state} type="text" placeholder="State" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                 </div>
//                 <div className="flex gap-3">
//                     <input name="zipcode" required onChange={onChangeHandler} value={formData.zipcode} type="number" placeholder="Zipcode" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                     <input name="country" required onChange={onChangeHandler} value={formData.country} type="text" placeholder="Country" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//                 </div>
//                 <input name="phone" required onChange={onChangeHandler} value={formData.phone} type="number" placeholder="Phone/Mobile Number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" />
//             </div>

//             {/* right side content  */}
//             <div className="">
//                 <div className="my-3 min-w-80">
//                     <CartTotal />
//                 </div>
//                 <div className="mt-3">
//                     <div className='text-2xl'>
//                         <Title text1={'payment'} text2={'methods'} />
//                     </div>
//                     <div className="flex gap-3 flex-col lg:flex-row">
//                         {/* <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border px-3  p-2 cursor-pointer">
//                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? "bg-green-400" : ""}`}></p>
//                             <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
//                         </div> */}
//                         <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border px-3  p-2 cursor-pointer">
//                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? "bg-green-400" : ""}`}></p>
//                             <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
//                         </div>
//                         <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border px-3  p-2 cursor-pointer">
//                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? "bg-green-400" : ""}`}></p>
//                             <p className="uppercase text-gray-400 font-medium mx-4">cash on delivery</p>
//                         </div>
//                         <div onClick={() => setMethod('whatsapp')} className="flex items-center gap-3 border px-3  p-2 cursor-pointer">
//                             <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'whatsapp' ? "bg-green-400" : ""}`}></p>
//                             <img src={whatsapp_logo} alt="whatsapp" className="min-w-3.5 h-5 mx-4" />
//                             <p className="uppercase text-gray-400 font-medium -translate-x-4.5 ">WhatsApp</p>
//                         </div>


//                     </div>

//                     <div className="w-full text-end mt-8">
//                         <button type="submit" className="uppercase bg-black text-white px-16 py-3 text-sm ">place order</button>
//                     </div>
//                 </div>
//             </div>

//         </form>
//     )
// }

// export default PlaceOrder
