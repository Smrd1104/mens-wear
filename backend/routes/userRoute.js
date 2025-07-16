import express from "express"

import {
    loginUser, registerUser,
    adminLogin, forgotPassword,
    verifyOtp, resetPassword,
    getUserDetails, getUserAddresses,
    addUserAddress, deleteUserAddress
} from "../controllers/userController.js"


const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)


// forgot password

userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);


userRouter.get("/me", getUserDetails);


// ✅ Address Routes (with auth middleware)
userRouter.get("/addresses", authUser, getUserAddresses);
userRouter.post("/addresses", authUser, addUserAddress);
userRouter.delete("/addresses/:index", authUser, deleteUserAddress);


export default userRouter