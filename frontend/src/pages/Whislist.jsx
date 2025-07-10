import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";

const Wishlist = () => {
  const { wishlist, products, productsLoaded } = useContext(ShopContext);

  // ✅ Only show loading while product data is not ready
  const isLoading = !productsLoaded;

  // ✅ Filter products that exist in the wishlist
  const wishlistProducts = products.filter((p) => wishlist.includes(p._id));

  if (isLoading) {
    return <div className="text-center py-10">Loading wishlist...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Wishlist</h1>

      {wishlistProducts.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              discountPrice={item.discountPrice}
              bestseller={item.bestseller}
              latest={item.latest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
