import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const { backendUrl, navigate } = useContext(ShopContext);

    const [step, setStep] = useState(1); // 1=Email, 2=OTP, 3=New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const sendOtp = async () => {
        try {
            const res = await axios.post(backendUrl + "/api/user/forgot-password", { email });
            if (res.data.success) {
                toast.success('OTP sent to your email!');
                setStep(2);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await axios.post(backendUrl + "/api/user/verify-otp", { email, otp });
            if (res.data.success) {
                toast.success('OTP Verified!');
                setStep(3);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        }
    };

    const resetPassword = async () => {
        try {
            const res = await axios.post(backendUrl + "/api/user/reset-password", { email, newPassword });
            if (res.data.success) {
                toast.success('Password reset successful!');
                navigate('/login'); // or home
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[250px] px-4">
            <div className="w-full max-w-md bg-white ">
                <h2 className=" mb-4 text-center prata-regular text-3xl">Forgot Password</h2>

                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            className="w-full mb-4 px-4 py-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={sendOtp} className="w-full bg-black text-white py-2 rounded">
                            Send OTP
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full mb-4 px-4 py-2 border rounded"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={verifyOtp} className="w-full bg-black text-white py-2 rounded">
                            Verify OTP
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full mb-4 px-4 py-2 border rounded"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button onClick={resetPassword} className="w-full bg-black text-white py-2 rounded">
                            Reset Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
