import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import { assets } from "../assets/frontend_assets/assets"
import RelatedProducts from "../components/RelatedProducts"
import { useRef } from "react";

const Product = () => {

    const { productId } = useParams()
    const { products, currency, addToCart, cartItems, updateQuantity, getCartAmount, delivery_fee, navigate } = useContext(ShopContext)
    const [productData, setProductData] = useState(false)
    const [image, setImage] = useState('')
    const [size, setSize] = useState('')
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];


    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setCartSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cartSidebarOpen]);



    const fetchProductData = async () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage(item.image[0])
                return null;
            }
        })
    }

    useEffect(() => {
        fetchProductData()
    }, [productId, products])

    return productData ? (
        <div className="border-t-2 pt-22 transition-opacity ease-in duration-500 opacity-100">

            {/* product data */}
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                {/* product image */}
                <div className="flex-1 flex-col-reverse flex gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {
                            productData.image.map((item, index) => (
                                <img onClick={() => setImage(item)} key={index} src={item} alt="" className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer" />
                            ))
                        }
                    </div>
                    <div className="w-full sm:w-[80%]">
                        <img className="w-full h-auto" src={image} alt="" />

                    </div>

                </div>
                {/* product info */}
                <div className="flex-1">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <div className="flex items-center gap-1 mt-2">
                        <img src={assets.star_icon} className="w-3.5" alt="" />
                        <img src={assets.star_icon} className="w-3.5" alt="" />
                        <img src={assets.star_icon} className="w-3.5" alt="" />
                        <img src={assets.star_icon} className="w-3.5" alt="" />
                        <img src={assets.star_dull_icon} className="w-3.5" alt="" />
                        <p className="pl-2">(122)</p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <p className="mt-5 text-3xl font-medium text-red-600">{currency}{productData.price}.00</p>
                        <p className="mt-5 text-3xl font-medium line-through">{currency}{productData.discountPrice}.00</p>
                    </div>
                    <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {[...new Set(productData.sizes)] // ✅ removes duplicates
                                .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)) // ✅ sort properly
                                .map((item, index) => (
                                    <button
                                        onClick={() => setSize(item)}
                                        className={`cursor-pointer px-4 py-2 bg-gray-100 border ${item === size ? "bg-orange-500 text-white" : ""
                                            }`}
                                        key={index}
                                    >
                                        {item}
                                    </button>
                                ))}
                        </div>


                    </div>
                    <button onClick={() => {
                        addToCart(productData._id, size);
                        setCartSidebarOpen(true); // 👈 This opens the sidebar
                    }} className="uppercase cursor-pointer hover:scale-105 transition-all duration-500 bg-black text-white px-8 py-3 text-sm active:bg-gray-700">Add to cart</button>
                    <hr className="mt-8 sm:w-4/5" />
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                        <p className=" capitalize">100% original products</p>
                        <p className="capitalize">Cash on delivery available on this product </p>
                        <p className="capitalize">easy return and exchange policy 7 days.</p>

                    </div>
                </div>
            </div>

            {/* Cart Sidebar */}
            {cartSidebarOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0  z-40"
                        onClick={() => setCartSidebarOpen(false)}
                        ref={sidebarRef}

                    />

                    {/* Sidebar */}
                    <div ref={sidebarRef}
                        className="fixed top-0 right-0 h-screen w-80 bg-white shadow-lg z-50 transition-transform duration-300">
                        <div className="flex justify-between items-center p-6  border-b-2 ">
                            <h2 className="text-lg font-semibold">Your Cart</h2>
                            <button onClick={() => setCartSidebarOpen(false)} className="text-xl">×</button>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-250px)] ">
                            {Object.keys(cartItems).length === 0 ? (
                                <p className="text-center py-8">Your cart is empty</p>
                            ) : (
                                Object.entries(cartItems).map(([itemId, sizes]) => {
                                    const product = products.find(p => p._id === itemId);
                                    if (!product) return null;

                                    return Object.entries(sizes).map(([size, quantity]) => (
                                        <div key={`${itemId}-${size}`} className="flex gap-4 border-b pb-4">
                                            <img
                                                src={product.image[0]}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex flex-col justify-between w-full">
                                                <div>
                                                    <p className="text-sm font-semibold">{product.name}</p>
                                                    <p className="text-xs text-gray-500">Size: <span className="font-medium">{size}</span></p>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {currency}{product.price} × {quantity} = {currency}{product.price * quantity}
                                                    </p>
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => updateQuantity(itemId, size, Math.max(quantity - 1, 1))}
                                                            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-sm">{quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(itemId, size, quantity + 1)}
                                                            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <img
                                                        onClick={() => updateQuantity(itemId, size, 0)}
                                                        src={assets.bin_icon}
                                                        alt="Remove"
                                                        className="w-4 h-4 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t">
                            {Object.keys(cartItems).length > 0 && (
                                <div className="flex justify-between text-sm font-semibold mb-4">
                                    <p>Total</p>
                                    <p>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</p>
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setCartSidebarOpen(false);
                                        navigate('/cart');
                                    }}
                                    className="text-black cursor-pointer bg-white border hover:bg-black hover:text-white uppercase px-4 py-2 text-sm rounded"
                                >
                                    Go to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        setCartSidebarOpen(false);
                                        navigate('/place-order');
                                    }}
                                    className="text-black cursor-pointer bg-white border hover:bg-black hover:text-white uppercase px-4 py-2 text-sm rounded"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}


            {/* description & review section  */}
            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm capitalize">description </b>
                    <p className="border px-5 py-3 text-sm capitalize">Review (122)</p>
                </div>
                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                    <p>Welcome to our eCommerce store — your one-stop destination for premium fashion, accessories, and lifestyle essentials. We bring you a carefully curated collection of top-quality products from trusted brands and emerging designers, all at competitive prices. Whether you're shopping for everyday basics or something special, our platform ensures a seamless, secure, and satisfying shopping experience with fast delivery and easy returns.</p>
                    <p>Our mission is to make online shopping effortless, enjoyable, and accessible to everyone. With a user-friendly interface, powerful search and filter options, and responsive customer support, we’re committed to providing an experience that puts your needs first. Discover new arrivals, browse bestsellers, and find exclusive deals — all from the comfort of your home.</p>
                </div>

            </div>
            {/* display related product */}

            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : <div className="opacity-0"></div>
}

export default Product