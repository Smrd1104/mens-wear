import React, { useState } from 'react';

const Login = () => {
    const [currentState, setCurrentState] = useState("Sign Up");

    const onSubmitHandler = async (event) => {
        event.preventDefault()
    }

    return (
        <div className="flex items-center justify-center my-20 px-4">
            <form onSubmit={onSubmitHandler} className="w-full max-w-md flex flex-col gap-6 text-gray-800">
                {/* Header */}
                <div className="flex items-center justify-center  gap-3 mb-4">
                    <p className="text-3xl prata-regular ">{currentState}</p>
                    <hr className="w-8  h-[1.5px] bg-gray-800 border-none" />
                </div>

                {/* Conditional Name Field */}
                {currentState !== 'Login' && (
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full px-4 py-2 border border-gray-800 rounded-sm"
                    />
                )}

                {/* Email Field */}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-800 rounded-sm"
                />

                {/* Password Field */}
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-800 rounded-sm"
                />
                <div className='w-full flex justify-between text-sm mt-[-8px]'>
                    <p className='capitalize cursor-pointer'>forgot your password ?</p>
                    {
                        currentState === 'Login'
                            ? <p onClick={() => setCurrentState('Sign Up')} className=' cursor-pointer'>Create Account</p>
                            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
                    }
                </div>

                <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === "Login" ? "Sign In" : "Sign Up"}</button>
            </form>
        </div>
    );
};

export default Login;
