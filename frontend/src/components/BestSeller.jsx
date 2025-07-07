import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import Title from './Title';
import ProductItem from './ProductItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (!products || products.length === 0) return;
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 10)); // Only first 10 bestsellers
    }, [products]);

    // Split into two groups for top and bottom sliders
    const topRow = bestSeller.slice(0, Math.ceil(bestSeller.length / 2));
    const bottomRow = bestSeller.slice(Math.ceil(bestSeller.length / 2));

    const breakpoints = {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 4 },
        // 1536: { slidesPerView: 6 },
        // 1920: { slidesPerView: 7 },
        // 2560: { slidesPerView: 8 },
        // 3840: { slidesPerView: 10 },
    };

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Discover what our customers love the most. These top-rated, most-loved products are flying off the shelves — grab yours before they're gone!
                </p>
            </div>

            {/* Top Row Swiper */}
            <Swiper
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={breakpoints}
                className="px-4 mb-6"
            >
                {topRow.map((item, index) => (
                    <SwiperSlide key={`top-${index}`}>
                        <ProductItem
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            bestseller={item.bestseller}

                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Bottom Row Swiper */}
            <Swiper
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={breakpoints}
                className="px-4"
            >
                {bottomRow.map((item, index) => (
                    <SwiperSlide key={`bottom-${index}`}>
                        <ProductItem
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            bestseller={item.bestseller}

                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BestSeller;
