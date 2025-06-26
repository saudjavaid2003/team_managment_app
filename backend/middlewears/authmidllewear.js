const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (only accessible to authenticated users)
const protect = async (req, res, next) => {

    try {
console.log("Authorization Header:", req.headers.authorization);

        // ✅ Fix: header name should be 'authorization', not 'req.header.authorization'
        let token = req.headers.authorization;

        // Check if token exists and starts with 'Bearer'
        if (token && token.startsWith("Bearer ")) {
            // Extract token (remove "Bearer " prefix)
            token = token.split(" ")[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Attach the user object (without password) to req.user
            req.user = await User.findById(decoded.id).select("-password");

            // Proceed to next middleware or route
            next();
        } else {
            res.status(401).json({ message: "Not authorized, token missing or invalid" });
        }
    } catch (e) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// Middleware to allow only admin users
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next(); // User is admin, proceed
    } else {
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};

module.exports = { protect, adminOnly };
