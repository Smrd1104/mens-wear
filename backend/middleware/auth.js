import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    const { token } = req.headers


    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" })
    }

    try {
        const decoded  = jwt.verify(token, process.env.JWT_SECRET)

        req.user = { id: decoded.id }; // ✅ Set user on request
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser