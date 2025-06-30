import React from 'react'
import Title from "../components/Title"
import { assets } from "../assets/frontend_assets/assets"
import NewsLetter from "../components/NewsLetter"
const About = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'about '} text2={'us'} />
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img src={assets.about_img} alt='' className='w-full sm:max-w-[450px]' />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>Welcome to shop-e, where fashion meets comfort and individuality. Born from a passion for timeless trends and everyday essentials, we bring you a carefully curated collection of clothing for men, women, and kids. Whether you’re dressing up for a special occasion or elevating your everyday wardrobe, our styles are designed to make you look good and feel confident.</p>
                    <p>At shop-e, quality is stitched into every seam. From breathable fabrics to thoughtful fits, we ensure each piece reflects both modern trends and lasting craftsmanship. With a strong focus on sustainability, affordability, and customer satisfaction, we’re more than just a clothing store — we’re your go-to style partner for every season.</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>At shop-e our, mission is to empower individuals to express their unique style with confidence. We believe fashion should be inclusive, accessible, and a reflection of your personality — not just a trend. That’s why we are committed to delivering high-quality, comfortable, and stylish clothing that caters to all ages, body types, and lifestyles.</p>
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