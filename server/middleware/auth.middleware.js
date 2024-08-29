const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Ensure the Authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from the database
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user role is allowed
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user; // Attach user to request
      next();
    } catch (err) {
      console.error("Authorization error:", err.message);
      res.status(401).json({ message: "Not authorized" });
    }
  };
};

module.exports = authorize;
