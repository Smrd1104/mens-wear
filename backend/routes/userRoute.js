import express from "express"

import {
    loginUser, registerUser, adminLogin, forgotPassword,
    verifyOtp,
    resetPassword
} from "../controllers/userController.js"


const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)


// forgot password

userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);

export default userRouter