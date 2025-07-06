import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import { assets } from '../assets/frontend_assets/assets';
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // Initially show 8
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");

  // Toggle category selection
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Toggle subcategory selection
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Filter and sort products
  const applyFilter = () => {
    let productsCopy = [...products];

    // ✅ Apply search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    productsCopy = productsCopy.filter((item) => {
      const categoryMatch = category.length === 0 || category.includes(item.category);
      const subCategoryMatch = subCategory.length === 0 || subCategory.includes(item.subCategory);
      return categoryMatch && subCategoryMatch;
    });

    // Apply sorting
    if (sortOption === 'low-high') {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productsCopy);
    setVisibleCount(8); // Reset visible count on new filter
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, sortOption, search, showSearch, products]);

  // Load more handler
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-22 border-t'>
      {/* Filter Sidebar */}
      <div className='min-w-60'>
        <p
          className='my-2 text-xl flex items-center uppercase cursor-pointer gap-2'
          onClick={() => setShowFilter(!showFilter)}
        >
          filters
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=''
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"}`}>
          <p className='uppercase mb-3 text-sm font-medium'>categories</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2'>
              <input className='w-3' type='checkbox' value='Men' onChange={toggleCategory} />Men
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type='checkbox' value='Women' onChange={toggleCategory} />Women
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type='checkbox' value='Kids' onChange={toggleCategory} />Kids
            </label>
          </div>
        </div>

        {/* Subcategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"}`}>
          <p className='uppercase mb-3 text-sm font-medium'>Type</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2'>
              <input className='w-3' type='checkbox' value='Topwear' onChange={toggleSubCategory} />Top Wear
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type='checkbox' value='Bottomwear' onChange={toggleSubCategory} />Bottom Wear
            </label>
            <label className='flex gap-2'>
              <input className='w-3' type='checkbox' value='Winterwear' onChange={toggleSubCategory} />Winter Wear
            </label>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select
            className='border-2 border-gray-300 text-sm px-2'
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product Items */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.slice(0, visibleCount).map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filterProducts.length && (
          <div className='text-center mt-8'>
            <button
              onClick={handleLoadMore}
              className='px-6 py-2 border border-black  cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300'
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
