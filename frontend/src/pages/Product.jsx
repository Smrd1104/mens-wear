import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import ReviewSection from "../components/ReviewSection";

const Product = () => {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const { productId } = useParams();
    const [skuLoading, setSkuLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [showReviewPopup, setShowReviewPopup] = useState(false);

    const reviewRef = useRef(null);

    const {
        products,
        currency,
        addToCart,
        cartItems,
        updateQuantity,
        getCartAmount,
        delivery_fee,
        backendUrl,
        token,
        navigate,
    } = useContext(ShopContext);

    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState("");
    const [size, setSize] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
    const [skuList, setSkuList] = useState([]);
    const [stockStatus, setStockStatus] = useState("");
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setCartSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [cartSidebarOpen]);

    useEffect(() => {
        const item = products.find((p) => p._id === productId);
        if (item) {
            setProductData(item);
            setImage(item.image[0]);
            if (item.colors?.length > 0) setSelectedColor(item.colors[0]);
        }
    }, [productId, products]);

    useEffect(() => {
        const fetchSKU = async () => {
            if (!productId) return;
            try {
                setSkuLoading(true);
                const res = await axios.get(`${backendUrl}/api/sku/product/${productId}`);
                setSkuList(res.data.data || []);
            } catch (error) {
                console.error("SKU fetch error:", error.message);
                setSkuList([]);
            } finally {
                setSkuLoading(false);
            }
        };
        fetchSKU();
    }, [productId]);
    useEffect(() => {
        if (productData) {
            setBreadcrumbs([
                { name: "Home", path: "/" },
                { name: productData.category, path: null },
                { name: productData.subCategory, path: null },
                { name: productData.name, path: null },
            ]);
        }
    }, [productData]);

    useEffect(() => {
        if (size && selectedColor && skuList.length > 0) {
            const sku = skuList.find((s) => s.size === size && s.color === selectedColor);
            if (sku) {
                if (sku.quantityAvailable === 0) {
                    setStockStatus("Out of Stock");
                } else {
                    setStockStatus(`In Stock (${sku.quantityAvailable})`);
                }
            } else {
                setStockStatus("Not available");
            }
        } else {
            setStockStatus("");
        }
    }, [size, selectedColor, skuList]);

    const handleAddToCart = () => {
        const selectedSKU = skuList.find((sku) => sku.size === size && sku.color === selectedColor);
        if (!size || !selectedColor) return alert("Select size and color");
        if (!selectedSKU || selectedSKU.quantityAvailable <= 0) return alert("This variation is out of stock");
        addToCart(productData._id, size, selectedColor);
        setCartSidebarOpen(true);
    };

    return productData ? (
        <div className="border-t-2 pt-22">
            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                )}
                                {crumb.path ? (
                                    <Link
                                        to={crumb.path}
                                        className="inline-flex items-center text-md font-medium text-gray-600 hover:text-black hover:underline"
                                    >
                                        {crumb.name}
                                    </Link>
                                ) : (
                                    <span className="text-md font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                                        {crumb.name}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            <div className="flex flex-col sm:flex-row gap-12">
                <div className="flex-1 flex-col-reverse flex gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full">
                        {productData.image.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                onClick={() => setImage(img)}
                                className="w-[24%] sm:w-full sm:mb-3 cursor-pointer"
                            />
                        ))}
                    </div>
                    <div className="w-full sm:w-[80%]">
                        <img className="w-full" src={image} alt="" />
                    </div>
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl font-medium">{productData.name}</h1>
                    <p className="mt-5 text-3xl font-medium text-red-600">
                        {currency}
                        {Number(productData.price).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                    {productData.discountPrice && (
                        <p className="line-through text-xl">
                            {currency}
                            {Number(productData.discountPrice).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    )}

                    <p className="mt-5 text-gray-500">{productData.description}</p>

                    {productData.colors?.length > 0 && (
                        <div className="my-4">
                            <p>Select Color</p>
                            <div className="flex gap-2 mt-2">
                                {productData.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(color)}
                                        style={{ backgroundColor: color }}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "ring-2 ring-black" : ""}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="my-4">
                        <p>Select Size</p>
                        <div className="flex gap-2 mt-2">
                            {[...new Set(productData.sizes)]
                                .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
                                .map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSize(item)}
                                        className={`px-4 py-2 border ${item === size ? "bg-black text-white" : "bg-gray-100"}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                        </div>
                    </div>

                    {stockStatus && <p className="text-sm mt-2 text-gray-600">Stock: {stockStatus}</p>}

                    <button
                        onClick={handleAddToCart}
                        className="mt-4 uppercase bg-black text-white px-8 py-3 hover:opacity-90"
                    >
                        Add to cart
                    </button>

                    <button
                        onClick={() => setShowReviewPopup(true)}
                        className="mt-4 ml-4 text-sm underline text-black hover:text-gray-700"
                    >
                        Write a Review
                    </button>



                </div>


            </div>


            {/* <div className="mt-12">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm capitalize">description</b>
                    <p className="border px-5 py-3 text-sm capitalize">Review (122)</p>
                </div>
                <div className="border px-6 py-6 text-sm text-gray-500">
                    <p>{productData.description}</p>
                </div>
            </div> */}
            <div className="mt-12" ref={reviewRef}>
                <div className="flex">
                    <b
                        className={`border px-5 py-3 text-sm capitalize cursor-pointer ${activeTab === "description" ? "bg-black text-white" : ""
                            }`}
                        onClick={() => setActiveTab("description")}
                    >
                        description
                    </b>
                    <p
                        className={`border px-5 py-3 text-sm capitalize cursor-pointer ${activeTab === "review" ? "bg-black text-white" : ""
                            }`}
                        onClick={() => setActiveTab("review")}
                    >
                        Review
                    </p>
                </div>

                <div className="border px-6 py-6 text-sm text-gray-500">
                    {activeTab === "description" ? (
                        <p>{productData.description}</p>
                    ) : (
                        <ReviewSection productId={productData._id} />
                    )}
                </div>
            </div>


            {showReviewPopup && (
                <>
                    {/* Background overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
                        onClick={() => setShowReviewPopup(false)}
                    ></div>

                    {/* Review popup content */}
                    <div className="fixed z-50 top-1/2 left-1/2 w-full max-w-2xl transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Write a Review</h2>
                            <button
                                onClick={() => setShowReviewPopup(false)}
                                className="text-2xl leading-none hover:text-red-600"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Review form inside popup */}
                        <ReviewSection productId={productData._id} />
                    </div>
                </>
            )}




            {/* Cart Sidebar */}
            {cartSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
                        onClick={() => setCartSidebarOpen(false)}
                        ref={sidebarRef}
                    />
                    <div
                        ref={sidebarRef}
                        className="fixed top-0 right-0 h-screen w-80 bg-white shadow-lg z-50 transition-transform duration-300"
                    >
                        <div className="flex justify-between items-center p-6 border-b-2">
                            <h2 className="text-lg font-semibold">Your Cart</h2>
                            <button onClick={() => setCartSidebarOpen(false)} className="text-xl">×</button>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-250px)]">
                            {Object.keys(cartItems).length === 0 ? (
                                <p className="text-center py-8">Your cart is empty</p>
                            ) : (
                                Object.entries(cartItems).map(([itemId, variants]) => {
                                    const product = products.find(p => p._id === itemId)
                                    if (!product) return null

                                    return Object.entries(variants).map(([variantKey, quantity]) => {
                                        const [size, color] = variantKey.split('|')
                                        return (
                                            <div key={variantKey} className="flex gap-4 border-b pb-4">
                                                <img
                                                    src={product.image[0]}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex flex-col justify-between w-full">
                                                    <div>
                                                        <p className="text-sm font-semibold">{product.name}</p>
                                                        <div className="flex gap-2 items-center mt-1">
                                                            <p className="text-xs text-gray-500">Size: {size}</p>
                                                            {color && (
                                                                <>
                                                                    <p className="text-xs text-gray-500">Color:</p>
                                                                    <div
                                                                        className="w-3 h-3 rounded-full border"
                                                                        style={{ backgroundColor: color }}
                                                                        title={color}

                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col  mt-2">
                                                        <div className="flex flex-row justify-between">
                                                            <p className="text-sm font-semibold text-gray-700">
                                                                {currency}
                                                                {Number(product.price).toLocaleString('en-IN', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}
                                                                × {quantity} = {currency}
                                                                {Number(product.price * quantity).toLocaleString('en-IN', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}
                                                            </p>
                                                            <img
                                                                onClick={() => updateQuantity(itemId, variantKey, 0)}
                                                                src={assets.bin_icon}
                                                                alt="Remove"
                                                                className="w-4 h-4 cursor-pointer"
                                                            />
                                                        </div>
                                                        <div className="flex flex-row justify-between  mt-2 gap-2 items-center">
                                                            <div className="flex flex-row gap-2 ">
                                                                <button
                                                                    onClick={() => updateQuantity(itemId, variantKey, Math.max(quantity - 1, 1))}
                                                                    className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="text-sm">{quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(itemId, variantKey, quantity + 1)}
                                                                    className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                })
                            )}
                        </div>

                        <div className="p-4 border-t">
                            {Object.keys(cartItems).length > 0 && (
                                <div className="flex justify-between text-sm font-semibold mb-4">
                                    <p>Total</p>
                                    <p> {currency}
                                        {Number(
                                            getCartAmount() === 0 ? 0 : getCartAmount()
                                        ).toLocaleString('en-IN', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}</p>
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setCartSidebarOpen(false)
                                        navigate('/cart')
                                    }}
                                    className="text-black cursor-pointer bg-white border hover:bg-black hover:text-white uppercase px-4 py-2 text-sm rounded"
                                >
                                    Go to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        setCartSidebarOpen(false)
                                        navigate('/place-order')
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


            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default Product;







// import { useContext, useEffect, useState } from "react"
// import { Link, useParams } from "react-router-dom"
// import { ShopContext } from "../context/ShopContext"
// import { assets } from "../assets/frontend_assets/assets"
// import RelatedProducts from "../components/RelatedProducts"
// import { useRef } from "react";

// const Product = () => {
//     const [breadcrumbs, setBreadcrumbs] = useState([]);

//     const { productId } = useParams()
//     const { products, currency, addToCart, cartItems, updateQuantity, getCartAmount, delivery_fee, navigate } = useContext(ShopContext)
//     const [productData, setProductData] = useState(false)
//     const [image, setImage] = useState('')
//     const [size, setSize] = useState('')
//     const [selectedColor, setSelectedColor] = useState(null)
//     const [cartSidebarOpen, setCartSidebarOpen] = useState(false)
//     const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

//     const sidebarRef = useRef(null)

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (cartSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//                 setCartSidebarOpen(false)
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside)

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside)
//         }
//     }, [cartSidebarOpen])

//     const fetchProductData = async () => {
//         products.map((item) => {
//             if (item._id === productId) {
//                 setProductData(item)
//                 setImage(item.image[0])
//                 // Set default color if available
//                 if (item.colors && item.colors.length > 0) {
//                     setSelectedColor(item.colors[0]) // Default to first color object
//                 }

//                 return null
//             }
//         })
//     }

//     useEffect(() => {
//         fetchProductData()
//     }, [productId, products])

//     const handleAddToCart = () => {
//         if (!size) {
//             alert('Please select a size')
//             return
//         }
//         if (!selectedColor && productData.colors?.length > 0) {
//             alert('Please select a color')
//             return
//         }
//         addToCart(productData._id, size, selectedColor)
//         setCartSidebarOpen(true)
//     }

//     useEffect(() => {
//         if (productData) {
//             setBreadcrumbs([
//                 { name: "Home", path: "/" },
//                 { name: productData.category, path: null },
//                 { name: productData.subCategory, path: null },
//                 { name: productData.name, path: null } // Current page
//             ]);


//         }
//     }, [productData]);


//     // path: `/collection/${productData.category.toLowerCase()



//     return productData ? (
//         <div className="border-t-2 pt-22 transition-opacity ease-in duration-500 opacity-100">

//             {/* Breadcrumb Navigation */}
//             <div className="container mx-auto px-4 sm:px-6 py-4">
//                 <nav className="flex" aria-label="Breadcrumb">
//                     <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
//                         {breadcrumbs.map((crumb, index) => (
//                             <li key={index} className="inline-flex items-center">
//                                 {index > 0 && (
//                                     <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                                         <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
//                                     </svg>
//                                 )}
//                                 {crumb.path ? (
//                                     <Link
//                                         to={crumb.path}
//                                         className="inline-flex items-center text-md font-medium text-gray-600 hover:text-black hover:underline"
//                                     >
//                                         {crumb.name}
//                                     </Link>
//                                 ) : (
//                                     <span className="text-md font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
//                                         {crumb.name}
//                                     </span>
//                                 )}
//                             </li>
//                         ))}
//                     </ol>
//                 </nav>
//             </div>

//             {/* Product Data */}
//             <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//                 {/* Product Images */}
//                 <div className="flex-1 flex-col-reverse flex gap-3 sm:flex-row">
//                     <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
//                         {productData.image.map((item, index) => (
//                             <img
//                                 onClick={() => setImage(item)}
//                                 key={index}
//                                 src={item}
//                                 alt=""
//                                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
//                             />
//                         ))}
//                     </div>
//                     <div className="w-full sm:w-[80%]">
//                         <img className="w-full h-auto" src={image} alt="" />
//                     </div>
//                 </div>

//                 {/* Product Info */}
//                 <div className="flex-1">
//                     <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
//                     <div className="flex items-center gap-1 mt-2">
//                         <img src={assets.star_icon} className="w-3.5" alt="" />
//                         <img src={assets.star_icon} className="w-3.5" alt="" />
//                         <img src={assets.star_icon} className="w-3.5" alt="" />
//                         <img src={assets.star_icon} className="w-3.5" alt="" />
//                         <img src={assets.star_dull_icon} className="w-3.5" alt="" />
//                         <p className="pl-2">(122)</p>
//                     </div>
//                     <div className="flex flex-row gap-3">
//                         <p className="mt-5 text-3xl font-medium text-red-600">
//                             {currency}
//                             {Number(productData?.price || 0).toLocaleString('en-IN', {
//                                 minimumFractionDigits: 2,
//                                 maximumFractionDigits: 2
//                             })}
//                         </p>
//                         {productData?.discountPrice && (
//                             <p className="mt-5 text-3xl font-medium line-through">
//                                 {currency}
//                                 {Number(productData.discountPrice).toLocaleString('en-IN', {
//                                     minimumFractionDigits: 2,
//                                     maximumFractionDigits: 2
//                                 })}
//                             </p>
//                         )}
//                     </div>
//                     <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

//                     {/* Color Picker - Only show if product has colors */}
//                     {productData.colors?.length > 0 && (
//                         <div className="flex flex-col gap-4 my-4">
//                             <p>Select Color</p>
//                             <div className="flex gap-2">
//                                 {productData.colors.map((color, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => setSelectedColor(color)}
//                                         className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
//                                         style={{ backgroundColor: color }}
//                                         title={color}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Size Picker */}
//                     <div className="flex flex-col gap-4 my-4">
//                         <p>Select Size</p>
//                         <div className="flex gap-2">
//                             {[...new Set(productData.sizes)]
//                                 .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
//                                 .map((item, index) => (
//                                     <button
//                                         onClick={() => setSize(item)}
//                                         className={`cursor-pointer px-4 py-2 bg-gray-100 border ${item === size ? "bg-orange-500 text-white" : ""}`}
//                                         key={index}
//                                     >
//                                         {item}
//                                     </button>
//                                 ))}
//                         </div>
//                     </div>

//                     <button
//                         onClick={handleAddToCart}
//                         className="uppercase cursor-pointer hover:scale-105 transition-all duration-500 bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
//                     >
//                         Add to cart
//                     </button>

//                     <hr className="mt-8 sm:w-4/5" />
//                     <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//                         <p className="capitalize">100% original products</p>
//                         <p className="capitalize">Cash on delivery available on this product</p>
//                         <p className="capitalize">Easy return and exchange policy 7 days.</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Cart Sidebar */}
//             {cartSidebarOpen && (
//                 <>
//                     <div
//                         className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
//                         onClick={() => setCartSidebarOpen(false)}
//                         ref={sidebarRef}
//                     />
//                     <div
//                         ref={sidebarRef}
//                         className="fixed top-0 right-0 h-screen w-80 bg-white shadow-lg z-50 transition-transform duration-300"
//                     >
//                         <div className="flex justify-between items-center p-6 border-b-2">
//                             <h2 className="text-lg font-semibold">Your Cart</h2>
//                             <button onClick={() => setCartSidebarOpen(false)} className="text-xl">×</button>
//                         </div>

//                         <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-250px)]">
//                             {Object.keys(cartItems).length === 0 ? (
//                                 <p className="text-center py-8">Your cart is empty</p>
//                             ) : (
//                                 Object.entries(cartItems).map(([itemId, variants]) => {
//                                     const product = products.find(p => p._id === itemId)
//                                     if (!product) return null

//                                     return Object.entries(variants).map(([variantKey, quantity]) => {
//                                         const [size, color] = variantKey.split('|')
//                                         return (
//                                             <div key={variantKey} className="flex gap-4 border-b pb-4">
//                                                 <img
//                                                     src={product.image[0]}
//                                                     alt={product.name}
//                                                     className="w-16 h-16 object-cover rounded"
//                                                 />
//                                                 <div className="flex flex-col justify-between w-full">
//                                                     <div>
//                                                         <p className="text-sm font-semibold">{product.name}</p>
//                                                         <div className="flex gap-2 items-center mt-1">
//                                                             <p className="text-xs text-gray-500">Size: {size}</p>
//                                                             {color && (
//                                                                 <>
//                                                                     <p className="text-xs text-gray-500">Color:</p>
//                                                                     <div
//                                                                         className="w-3 h-3 rounded-full border"
//                                                                         style={{ backgroundColor: color }}
//                                                                         title={color}

//                                                                     />
//                                                                 </>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex justify-between items-center mt-2">
//                                                         <p className="text-sm font-semibold text-gray-700">
//                                                             {currency}
//                                                             {Number(product.price).toLocaleString('en-IN', {
//                                                                 minimumFractionDigits: 2,
//                                                                 maximumFractionDigits: 2
//                                                             })}
//                                                             × {quantity} = {currency}
//                                                             {Number(product.price * quantity).toLocaleString('en-IN', {
//                                                                 minimumFractionDigits: 2,
//                                                                 maximumFractionDigits: 2
//                                                             })}

//                                                         </p>
//                                                         <div className="flex gap-2 items-center">
//                                                             <button
//                                                                 onClick={() => updateQuantity(itemId, variantKey, Math.max(quantity - 1, 1))}
//                                                                 className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
//                                                             >
//                                                                 −
//                                                             </button>
//                                                             <span className="text-sm">{quantity}</span>
//                                                             <button
//                                                                 onClick={() => updateQuantity(itemId, variantKey, quantity + 1)}
//                                                                 className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
//                                                             >
//                                                                 +
//                                                             </button>
//                                                         </div>
//                                                         <img
//                                                             onClick={() => updateQuantity(itemId, variantKey, 0)}
//                                                             src={assets.bin_icon}
//                                                             alt="Remove"
//                                                             className="w-4 h-4 cursor-pointer"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )
//                                     })
//                                 })
//                             )}
//                         </div>

//                         <div className="p-4 border-t">
//                             {Object.keys(cartItems).length > 0 && (
//                                 <div className="flex justify-between text-sm font-semibold mb-4">
//                                     <p>Total</p>
//                                     <p> {currency}
//                                         {Number(
//                                             getCartAmount() === 0 ? 0 : getCartAmount()
//                                         ).toLocaleString('en-IN', {
//                                             minimumFractionDigits: 2,
//                                             maximumFractionDigits: 2
//                                         })}</p>
//                                 </div>
//                             )}
//                             <div className="flex flex-col gap-3">
//                                 <button
//                                     onClick={() => {
//                                         setCartSidebarOpen(false)
//                                         navigate('/cart')
//                                     }}
//                                     className="text-black cursor-pointer bg-white border hover:bg-black hover:text-white uppercase px-4 py-2 text-sm rounded"
//                                 >
//                                     Go to Cart
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         setCartSidebarOpen(false)
//                                         navigate('/place-order')
//                                     }}
//                                     className="text-black cursor-pointer bg-white border hover:bg-black hover:text-white uppercase px-4 py-2 text-sm rounded"
//                                 >
//                                     Proceed to Checkout
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}

//             {/* Description & Reviews */}
//             <div className="mt-20">
//                 <div className="flex">
//                     <b className="border px-5 py-3 text-sm capitalize">description</b>
//                     <p className="border px-5 py-3 text-sm capitalize">Review (122)</p>
//                 </div>
//                 <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
//                     <p>Welcome to our eCommerce store — your one-stop destination for premium fashion, accessories, and lifestyle essentials. We bring you a carefully curated collection of top-quality products from trusted brands and emerging designers, all at competitive prices. Whether you're shopping for everyday basics or something special, our platform ensures a seamless, secure, and satisfying shopping experience with fast delivery and easy returns.</p>
//                     <p>Our mission is to make online shopping effortless, enjoyable, and accessible to everyone. With a user-friendly interface, powerful search and filter options, and responsive customer support, we're committed to providing an experience that puts your needs first. Discover new arrivals, browse bestsellers, and find exclusive deals — all from the comfort of your home.</p>
//                 </div>
//             </div>

//             {/* Related Products */}
//             <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
//         </div>
//     ) : <div className="opacity-0"></div>
// }

// export default Product