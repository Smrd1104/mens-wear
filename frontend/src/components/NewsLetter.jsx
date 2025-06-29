import React from 'react'

const NewsLetter = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();

    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% offer</p>
            <p className='text-gray-400 mt-3'>        Be the first to know about new arrivals, exclusive deals, and fashion tips. Join our community today!
            </p>

            <form className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:flex-1 outline-none"
                    required
                />
                <button
                    type="submit"
                    className="bg-black text-white text-xs px-10 py-4 uppercase cursor-pointer"
                >
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default NewsLetter