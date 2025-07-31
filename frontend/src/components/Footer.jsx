import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="text-sm px-5">
            <div className="flex flex-col sm:flex-row justify-between  gap-4 my-10">
                {/* Logo + Description */}
                <div className='flex flex-col sm:justify-center sm:items-center '>
                    <img src={assets.logo} className="mb-5 w-14 " alt="Logo" />
                    <p className="text-gray-900  prata-regular ">
                        "Step into style, anytime, anywhere.
                    </p> <p className="text-gray-900  prata-regular ">Your fashion, your rules"
                    </p>

                </div>

                {/* Company Links */}
                <div>
                    <p className="uppercase text-xl font-medium mb-5">Company</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy</li>
                    </ul>
                </div>

                {/* Add another section here if you want 3 columns */}
                <div>
                    <p className="uppercase text-xl font-medium mb-5">Get in touch</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>+1 23456 78910</li>
                        <li>contact@mail.com</li>
                    </ul>
                </div>
            </div>
            <div className='mt-2'>
                <hr />
                <Link target='_blank' to="https://mens-wear-backend.onrender.com/">  <p className='py-5 text-sm text-center'>trends-wear.onrender.com.</p></Link>

            </div>
        </div>
    );
};

export default Footer;
