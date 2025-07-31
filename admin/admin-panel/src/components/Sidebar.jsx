import React from 'react'
import { assets } from '../assets/admin_assets/assets'
import { NavLink } from "react-router-dom"
import { LayoutDashboard } from 'lucide-react';
import { CirclePlus } from 'lucide-react';
import { ListCheck } from 'lucide-react';
import { ListOrdered } from 'lucide-react';
import { UserStar } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/">
                    <LayoutDashboard />
                    <p className='hidden md:block'>Dashboard </p>
                </NavLink>
                <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/add">
                    <CirclePlus />
                    <p className='hidden md:block'>Add Items </p>
                </NavLink>

                <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/list">
                    <ListCheck />
                    <p className='hidden md:block'>List Items </p>
                </NavLink>

                <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/orders">
                    <ListOrdered />
                    <p className='hidden md:block'>Orders </p>
                </NavLink>

                <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l" to="/reviews">
                    <UserStar />
                    <p className='hidden md:block'>Reviews </p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar