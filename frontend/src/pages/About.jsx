import React, { useState } from 'react'
import Title from "../components/Title"
import { assets } from "../assets/frontend_assets/assets"
import NewsLetter from "../components/NewsLetter"
import { Link } from 'react-router-dom'
const About = () => {
    const [breadcrumbs] = useState([ // Removed setBreadcrumbs since we're not changing it
        { name: "Home", path: "/" },
        { name: "About", path: null } // Current page (no link)
    ]);

    return (
        <div>
            <div className='text-2xl text-center pt-22 border-t'>
                {/* Breadcrumb Navigation */}
                <div className="container mx-auto px-4 sm:px-6 py-4">
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


                <Title text1={'about '} text2={'us'} />
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img src={assets.about_img} alt='' className='w-full sm:max-w-[450px]' />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>At Trends Wear, we're passionate about bringing you the latest fashion trends at affordable prices. Our carefully curated collections are designed to help you express your unique style while staying comfortable and confident. From casual everyday wear to standout statement pieces, we offer something for every taste and occasion.</p>
                    <p>Join the Trends Wear community and discover fashion that fits your lifestyle. Whether you're updating your wardrobe or searching for the perfect outfit, we're here to inspire and outfit you for every moment. Shop with us today and experience the joy of looking and feeling your best!</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>At Trends Wear, we empower individuals to embrace their unique style with affordable, on-trend fashion that blends quality, comfort, and confidence. We're committed to making the latest styles accessible to everyone while fostering sustainability and inclusivity in every collection. By prioritizing customer satisfaction and ethical practices, we aim to inspire self-expression through fashion that looks good and feels right.

                    </p>
                </div>
            </div>
            <div className='text-xl py-4'>
                <Title text1={'why'} text2={'choose us'} />
            </div>
            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b className='capitalize'>quality Assurance</b>
                    <p className='text-gray-600'>At shop-e, quality isn’t just a promise — it’s our foundation. Every garment we offer goes through a meticulous quality control process to ensure it meets the highest standards in fabric, stitching, comfort, and durability. From sourcing premium materials to the final thread, we pay attention to every detail so that you receive only the best.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b className='capitalize'>Convenience</b>
                    <p className='text-gray-600'>At shop-e, we make shopping effortless and enjoyable. Our user-friendly website, smooth navigation, and secure checkout process ensure a seamless experience from browsing to buying. Whether you're shopping on your phone or desktop, everything is designed for ease and speed.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b className='capitalize'>Exceptional Customer Service</b>
                    <p className='text-gray-600'>At shop-e, we don’t just sell clothes — we build relationships. Our customer service team is here to ensure your shopping experience is smooth, personalized, and hassle-free from start to finish. Whether you have a question, need help with sizing, or want support with an order, we're always just a message away.</p>
                </div>
            </div>
            <NewsLetter />
        </div>
    )
}

export default About