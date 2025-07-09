import { assets } from "../assets/frontend_assets/assets"
import Title from "../components/Title"
import NewsLetter from "../components/NewsLetter"
import { useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/frontend_assets/contact.jpeg"

const Contact = () => {
    const [breadcrumbs] = useState([ // Removed setBreadcrumbs since we're not changing it
        { name: "Home", path: "/" },
        { name: "Contact", path: null } // Current page (no link)
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
                <Title text1={'Contact '} text2={'us'} />
            </div>

            <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28">
                <img src={img} alt="" className=" w-full md:max-w-[480px]" />
                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="fond-semibold text-xl text-gray-600">Our Store</p>
                    <p className="text-gray-500">5252,street <br /> Chennai, TamilNadu</p>
                    <p className="text-gray-500">Tel: (125) 12536 89589 <br /> Email:contact@mail.com</p>
                    <p className="font-semibold text-xl text-gray-600">Careers at Trends Wear</p>
                    <p className="Capitalize text-gray-500">learn more about our teams and job openings</p>
                    <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 cursor-pointer">Explore Jobs</button>
                </div>
            </div>
            <NewsLetter />
        </div>
    )
}

export default Contact