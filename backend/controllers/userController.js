import userModel from "../models/userModel.js"
import validator from "validator"; // ✅ Add this line
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// route for user login

const loginUser = async (req, res) => {

}

// routes for  user register
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        // checking user already exist or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "user already exists" })
        }

        // validating email & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter valid email " })
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

}




export { loginUser, registerUser, adminLogin }
