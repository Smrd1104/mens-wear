import { assets } from "../assets/frontend_assets/assets"
import Title from "../components/Title"
import NewsLetter from "../components/NewsLetter"
const Contact = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-22 border-t'>
                <Title text1={'Contact '} text2={'us'} />
            </div>

            <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28">
                <img src={assets.contact_img} alt="" className=" w-full md:max-w-[480px]" />
                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="fond-semibold text-xl text-gray-600">Our Store</p>
                    <p className="text-gray-500">5252,street <br /> Chennai, TamilNadu</p>
                    <p className="text-gray-500">Tel: (125) 12536 89589 <br /> Email:contact@mail.com</p>
                    <p className="font-semibold text-xl text-gray-600">Careers at Forever</p>
                    <p className="Capitalize text-gray-500">learn more about our teams and job openings</p>
                    <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 cursor-pointer">Explore Jobs</button>
                </div>
            </div>
            <NewsLetter />
        </div>
    )
}

export default Contact