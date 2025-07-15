import userModel from "../models/userModel.js"
import validator from "validator"; // ✅ Add this line
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';

const otpStore = {}; // Should use DB or Redis in production


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// route for user login

const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const user = await userModel.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() }, // make email case-insensitive
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    return res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// const loginUser = async (req, res) => {

//     try {
//         const { email, password } = req.body

//         const user = await userModel.findOne({ email })
//         if (!user) {
//             return res.json({ success: false, message: "user does not exists" })
//         }

//         const isMatch = await bcrypt.compare(password, user.password)

//         if (isMatch) {
//             const token = createToken(user._id)
//             res.json({ success: true, token })
//         } else {
//             res.json({ success: false, message: "Invalid Credentials" })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// routes for  user register
const registerUser = async (req, res) => {

    try {
        const { name, email, password, phone } = req.body

        // checking user already exist or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "user already exists" })
        }

        // validating email & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter valid email " })
        }
        if (!/^\d{10}$/.test(phone)) {
            return res.json({ success: false, message: "Please enter a valid 10-digit phone number" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter strong password " })
        }

        // hashing user password

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// routes for admin login 

const adminLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}


// Send OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = otp;

        // Send email using nodemailer (or service like SendGrid)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Reset Your Password",
            html: `<h4>Your OTP is:</h4><b>${otp}</b>`
        });

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (otpStore[email] && otpStore[email] === otp) {
            return res.json({ success: true, message: "OTP Verified" });
        }
        res.json({ success: false, message: "Invalid OTP" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();
        delete otpStore[email]; // clear OTP after use

        res.json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};












export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, verifyOtp, getUserDetails }
