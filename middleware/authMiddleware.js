const jwt = require("jsonwebtoken");
const User = require("../model/models");
const redisClient = require("../config/redisClient")



const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const isBlacklisted = await cacheClient.get(`Blacklist_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token expired, login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = authMiddleware ;
