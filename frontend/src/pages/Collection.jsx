import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import { assets } from '../assets/frontend_assets/assets';
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Link } from 'react-router-dom';

const Collection = () => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // Initially show 8
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productsCopy = [...products];

    // Search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category and subcategory filters
    productsCopy = productsCopy.filter((item) => {
      const categoryMatch = category.length === 0 || category.includes(item.category);
      const subCategoryMatch = subCategory.length === 0 || subCategory.includes(item.subCategory);
      return categoryMatch && subCategoryMatch;
    });

    // Sorting logic
    if (sortOption === 'low-high') {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      productsCopy.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'best-seller') {
      productsCopy.sort((a, b) => {
        if (a.bestseller === b.bestseller) {
          return b.date - a.date; // If same, sort by newest
        }
        return b.bestseller - a.bestseller; // Bestsellers first
      });
    }

    setFilterProducts(productsCopy);
    setVisibleCount(8); // Reset count
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, sortOption, search, showSearch, products]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };


  useEffect(() => {

    setBreadcrumbs([
      { name: "Home", path: "/" },
      { name: "Collection", path: "/collection" },

    ]);



  }, []);

  return (

    <div className=''>

      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10  border-t pt-22'>


        {/* Filter Sidebar */}
        <div className='min-w-60'>
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto  sm:px-6 flex flex-col md:flex-row gap-6 sm:gap-10 mb-5">
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
                        className="inline-flex items-center text-[1rem] font-medium text-gray-600 hover:text-black hover:underline"
                      >
                        {crumb.name}
                      </Link>
                    ) : (
                      <span className="text-[1rem] font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                        {crumb.name}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
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
        <div className='flex-1 sm:mt-12 mt-1'>
          <div className='flex justify-between text-base sm:text-2xl mb-4 '>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            <select
              className='border-2 border-gray-300 text-sm px-2'
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
              <option value="best-seller">Sort by: Bestseller</option>
            </select>
          </div>

          {/* ✅ Product Count */}
          <p className="text-sm text-gray-600 mb-2">
            Showing {Math.min(visibleCount, filterProducts.length)} of {filterProducts.length} products
          </p>

          {/* Product Items */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 gap-y-6'>
            {filterProducts.slice(0, visibleCount).map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
                bestseller={item.bestseller}
                collection={item.collection}
                discountPrice={item.discountPrice}
                latest={item.latest}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filterProducts.length && (
            <div className='text-center mt-8'>
              <button
                onClick={handleLoadMore}
                className='px-6 py-2 border border-black cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300'
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
