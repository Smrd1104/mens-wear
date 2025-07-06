import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import { assets } from "../assets/frontend_assets/assets"
import RelatedProducts from "../components/RelatedProducts"
const Product = () => {

    const { productId } = useParams()
    const { products, currency, addToCart } = useContext(ShopContext)
    const [productData, setProductData] = useState(false)
    const [image, setImage] = useState('')
    const [size, setSize] = useState('')

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
                    <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
                    <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {productData.sizes.map((item, index) => (
                                <button onClick={() => setSize(item)} className={` cursor-pointer px-4 py-2 bg-gray-100 border ${item === size ? "bg-orange-500 text-white" : ""}`} key={index}>
                                    {item}
                                </button>
                            ))}
                        </div>

                    </div>
                    <button onClick={() => addToCart(productData._id, size)} className="uppercase cursor-pointer hover:scale-105 transition-all duration-500 bg-black text-white px-8 py-3 text-sm active:bg-gray-700">Add to card</button>
                    <hr className="mt-8 sm:w-4/5" />
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                        <p className=" capitalize">100% original products</p>
                        <p className="capitalize">Cash on delivery available on this product </p>
                        <p className="capitalize">easy return and exchange policy 7 days.</p>

                    </div>
                </div>
            </div>

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