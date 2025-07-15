import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, Navigate, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { Heart } from "lucide-react";


const Navbar = () => {

  const [visible, setVisible] = useState(false)
  const { updateQuantity, setShowSearch, getCartCount, getCartAmount, currency, products, navigate, token, setToken, setCartItems, cartItems } = useContext(ShopContext)
  const [accountOpen, setAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const hideTimeoutRef = useRef(null);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const { wishlist } = useContext(ShopContext);

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


  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token', token)
    setToken('')
    setCartItems({})

  }


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Always show header on scroll
      setShowHeader(true);
      setIsScrolled(scrollY > 10);

      // Clear the existing timeout
      clearTimeout(scrollTimeoutRef.current);

      // Start a new timeout to hide the header after 2s of no scroll
      scrollTimeoutRef.current = setTimeout(() => {
        if (window.scrollY > 10) {
          setShowHeader(false);
        }
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);


  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);







  return (
    <div
      className={`w-full fixed z-50 top-0 left-0 h-auto transform transition-all duration-500 ${isScrolled ? "backdrop-blur-md bg-white/70" : "bg-white shadow"
        } ${showHeader ? "translate-y-0" : "-translate-y-full"} md:px-10`}
      role="navigation"
    >
      <div className="flex  container mx-auto items-center justify-between py-3 px-4 sm:px-8 font-medium">


        <Link to="/"> <img src={assets.logo} alt="Logo" className="w-12 " /></Link>


        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1  ${isActive ? "active" : ""}`
            }
          >
            <p className="uppercase">Home</p>
            <hr className="underline-indicator" />
          </NavLink>

          <NavLink
            to="/collection"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? "active" : ""}`
            }
          >
            <p className="uppercase">Collection</p>
            <hr className="underline-indicator" />
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? "active" : ""}`
            }
          >
            <p className="uppercase">About</p>
            <hr className="underline-indicator" />
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? "active" : ""}`
            }
          >
            <p className="uppercase">Contact</p>
            <hr className="underline-indicator" />
          </NavLink>
        </ul>

        <div className="flex items-center  gap-6">
          <img onClick={() => setShowSearch(true)} src={assets.search_icon} className="w-5  cursor-pointer" alt="" />
          <div className="group relative">

            <img onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} className="w-5 cursor-pointer" alt="" />
            {/* dropdowm */}
            {token && <div className="group-hover:block hidden absolute z-10 dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">My Profile</p>
                <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">Order</p>
                <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
              </div>
            </div>}

          </div>
          <div onClick={() => setCartSidebarOpen(true)} className="relative cursor-pointer">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </div>

          <Link to="/wishlist" className="relative">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute right-[-5px] top-[-5px] w-4 text-center leading-4 bg-red-600 text-white aspect-square rounded-full text-[8px]">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setVisible(true)}
            className="w-5 cursor-pointer sm:hidden bg-transparent border-none p-0"
            aria-label="Open menu"
            type="button"
          >
            <img src={assets.menu_icon} alt="Menu" className="w-5" />
          </button>
          {/* sidebar menu for small screen */}
          {/* Overlay (click to close) */}
          {visible && (
            <div
              className="fixed inset-0  z-40"
              onClick={() => setVisible(false)}
            />
          )}

          {/* Sidebar */}
          {visible && (
            <>
              {/* Dimmed Overlay */}
              <div
                className="fixed inset-0   z-40"
                onClick={() => setVisible(false)}
              ></div>

              {/* Sidebar */}
              <div className="fixed inset-y-0 left-0 top-20 w-full h-screen bg-white z-50 shadow-lg transition-transform duration-300 overflow-y-auto">
                <div className="p-4">
                  <div
                    onClick={() => setVisible(false)}
                    className="flex items-center gap-2 mb-4 cursor-pointer"
                  >
                    <img src={assets.dropdown_icon} className="w-3 rotate-180" alt="Back" />
                    <span className="text-sm">Back</span>
                  </div>

                  <nav className="flex flex-col text-sm border-b ">
                    <NavLink to="/" onClick={() => setVisible(false)} className="py-3 pl-6 border-b">Home</NavLink>
                    <NavLink to="/collection" onClick={() => setVisible(false)} className="py-3 pl-6 border-b">Collection</NavLink>
                    <NavLink to="/about" onClick={() => setVisible(false)} className="py-3 pl-6 border-b">About</NavLink>
                    <NavLink to="/contact" onClick={() => setVisible(false)} className="py-3 pl-6 border-b">Contact</NavLink>
                  </nav>




                  {token && (
                    <div className="flex flex-col  mt-8">
                      {/* Toggle Header */}
                      <div
                        onClick={() => setAccountOpen(!accountOpen)}
                        className="flex items-center justify-between px-6 py-2 cursor-pointer text-gray-600"
                      >
                        <span className="text-lg font-semibold">Account</span>
                        <img
                          src={assets.dropdown_icon}
                          alt="Toggle"
                          className={`w-2 transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`}
                        />
                      </div>

                      {/* Collapsible Content */}
                      {accountOpen && (
                        <div className="flex flex-col border-b   text-sm transition-all duration-300 ease-in-out">
                          <p
                            onClick={() => {
                              navigate('/profile');
                              setVisible(false);
                            }}
                            className="py-3 pl-6 border-b hover:text-black cursor-pointer"
                          >
                            My Profile
                          </p>
                          <p
                            onClick={() => {
                              navigate('/orders');
                              setVisible(false);
                            }}
                            className="py-3 pl-6 border-b hover:text-black cursor-pointer"
                          >
                            Orders
                          </p>
                          <p
                            onClick={() => {
                              logout();
                              setVisible(false);
                            }}
                            className="py-3 pl-6 border-b hover:text-black cursor-pointer"
                          >
                            Logout
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </>
          )}


          {/* Cart Sidebar */}
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
              <div
                ref={sidebarRef}
                className="fixed top-18 right-0 h-screen w-80 bg-white shadow-lg z-50 transition-transform duration-300"
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




        </div>


      </div >
    </div>
  );
};

export default Navbar;
