import { assets } from "../assets/frontend_assets/assets";
import { PackageCheck } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import { Headset } from 'lucide-react';

const OurPolicy = () => {
    return (
        <div className='flex flex-col sm:flex-row justify-around  gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
            <div>
                <PackageCheck className="w-12 h-12 m-auto mb-5 " alt="" />
                <p className="font-semibold">Easy Exchange Policy</p>
                <p className="text-gray-400">We offer hassle free exchange policy</p>
            </div>
            <div>
                <PackageOpen className="w-12 h-12 m-auto mb-5 " alt="" />
                <p className="font-semibold">7 Days Return Policy</p>
                <p className="text-gray-400">We provide 7 days free return policy</p>
            </div>
            <div>
                <Headset className="w-12 h-12 m-auto mb-5 " alt="" />
                <p className="font-semibold">Best Customer Support </p>
                <p className="text-gray-400">We provide 24/7 customer support </p>
            </div>
        </div>
    )
}

export default OurPolicy