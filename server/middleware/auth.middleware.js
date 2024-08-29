// middleware/authorize.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user; // Attach user to request
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized" });
    }
  };
};

module.exports = authorize;
