import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext"
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const Login = () => {
    const [currentState, setCurrentState] = useState("Login");

    const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
    const [email, setEmail] = useState(''); // for Sign Up

    const [name, setName] = useState('')
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('');


    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (currentState === "Sign Up") {
                const response = await axios.post(backendUrl + "/api/user/register", { name, email, password, phone })

                if (response.data.success) {
                    console.log('response: ', response);
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)
                    toast.success("Login successful!");

                } else {
                    toast.error(response.data.message)
                }
            } else {
                const response = await axios.post(backendUrl + "/api/user/login", { emailOrPhone, password })
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)

                } else {
                    toast.error(response.data.message)

                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }


    useEffect(() => {
        if (token) {
            navigate("/")
        }
    }, [token])

    return (
        <div className="flex items-center justify-center my-20 pt-22 px-4">
            <form onSubmit={onSubmitHandler} className="w-full max-w-md flex flex-col gap-6 text-gray-800">
                {/* Header */}
                <div className="flex items-center justify-center  gap-3 mb-4">
                    <p className="text-3xl prata-regular ">{currentState}</p>
                    <hr className="w-8  h-[1.5px] bg-gray-800 border-none" />
                </div>

                {/* Conditional Name Field */}
                {currentState !== 'Login' && (
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full px-4 py-2 border border-gray-800 rounded-sm"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-800 rounded-sm"

                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full px-4 py-2 border border-gray-800 rounded-sm"
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                        />
                    </>
                )}

                {/* Email Field */}
                {/* Email/Phone field only for Login */}
                {currentState === 'Login' && (
                    <input
                        type="text"
                        placeholder="Email or Phone"
                        className="w-full px-4 py-2 border border-gray-800 rounded-sm"

                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        value={emailOrPhone}
                    />
                )}


                {/* Password Field */}
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-800 rounded-sm"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <div className='w-full flex justify-between text-sm mt-[-8px]'>
                    <Link to="/forgot-password">
                        <p className='capitalize cursor-pointer'>forgot your password ?</p>
                    </Link>
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
