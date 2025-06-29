import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400 '>
            {/* hero left side */}
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 '>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                        <p className='font-medium text-sm md:text-base uppercase'>our best sellers</p>
                    </div>
                    <h1 className='uppercase text-3xl lg:text-5xl leading-relaxed prata-regular'>latest arrivals</h1>
                    <div className='flex  items-center gap-2'>
                        <p className='font-semibold text-sm md:text-base uppercase'>Shop now</p>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    </div>
                </div>
            </div>
            {/* hero right side */}
            <img src={assets.hero_img} className="w-full sm:w-1/2" alt='' />

        </div>
    )
}

export default Hero