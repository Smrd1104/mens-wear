import jwt from "jsonwebtoken"
const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not Authorized Login Again" });
        }

        // Optional: req.admin = decoded;
        next();
    } catch (error) {
        console.error("adminAuth error:", error.message);
        return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }
};



export default adminAuth