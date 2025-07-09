import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "./ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        const reversedProducts = [...products].reverse();
        setLatestProducts(reversedProducts.slice(0, 10));
    }, [products]);

    const topRowProducts = latestProducts.slice(0, Math.ceil(latestProducts.length / 2));
    const bottomRowProducts = latestProducts.slice(Math.ceil(latestProducts.length / 2));

    const breakpoints = {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 4 },
        1536: { slidesPerView: 5 },
        // 1920: { slidesPerView: 6 },
        // 2560: { slidesPerView: 7 },
        // 3840: { slidesPerView: 8 },
    };

    return (
        <div className="my-10">
            {/* Title */}
            <div className="text-center py-8 text-3xl">
                <Title text1={"LATEST"} text2={"COLLECTIONS"} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Discover premium quality fashion with unbeatable comfort and timeless style. At our store, we believe clothing is more than just fabric — it's a statement. Explore our curated collections and find your next favorite piece today.
                </p>
            </div>

            {/* Top Row Slider */}
            <Swiper
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={breakpoints}
                className="px-4 mb-6"
            >
                {topRowProducts.map((item, index) => (
                    <SwiperSlide key={`top-${index}`}>
                        <ProductItem
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            discountPrice={item.discountPrice}
                            collection={item.collection}
                            latest={item.latest}


                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Bottom Row Slider */}
            <Swiper
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={breakpoints}
                className="px-4"
            >
                {bottomRowProducts.map((item, index) => (
                    <SwiperSlide key={`bottom-${index}`}>
                        <ProductItem
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            discountPrice={item.discountPrice}
                            collection={item.collection}
                            latest={item.latest}


                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default LatestCollection;
