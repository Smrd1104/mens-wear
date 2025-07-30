// auth.js
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { _id: decoded.id }; // 👈 This MUST match your token payload

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authUser;
