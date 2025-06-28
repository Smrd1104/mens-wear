import { useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {

  const [visible, setVisible] = useState(false)
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <img src={assets.logo} alt="Logo" className="w-36" />

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "active" : ""}`
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

      <div className="flex items-center gap-6">
        <img src={assets.search_icon} className="w-5 cursor-pointer" alt="" />
        <div className="group relative">
          <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Order</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5 cursor-pointer" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">0</p>
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
      </div>


    </div>
  );
};

export default Navbar;
