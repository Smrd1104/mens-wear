import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const FestiveProducts = () => {
  const { products } = useContext(ShopContext);
  const [trendingItems, setTrendingItems] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const trendingFiltered = products.filter((item) => item.trending); // 🔍 filter festive
    setTrendingItems(trendingFiltered.slice(0, 10)); // Limit to 10
  }, [products]);

  const topRow = trendingItems.slice(0, Math.ceil(trendingItems.length / 2));
  const bottomRow = trendingItems.slice(Math.ceil(trendingItems.length / 2));

  const breakpoints = {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    1280: { slidesPerView: 4 },
  };

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'Trending'} text2={'COLLECTION'} />
        {/* <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Celebrate the season with our exclusive festive picks. Shop now for the trendiest styles!
        </p> */}
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={2.4}
        breakpoints={breakpoints}
        className="px-4 mb-6"
      >
        {topRow.map((item, index) => (
          <SwiperSlide key={`festive-top-${index}`}>
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              trending={item.trending}
              discountPrice={item.discountPrice}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        spaceBetween={20}
        slidesPerView={2.4}
        breakpoints={breakpoints}
        className="px-4"
      >
        {bottomRow.map((item, index) => (
          <SwiperSlide key={`festive-bottom-${index}`}>
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              trending={item.trending}
              discountPrice={item.discountPrice}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FestiveProducts;
