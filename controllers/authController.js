const redis = require("../config/redisClient");
// Logout controller: blacklist token in Redis

const User = require("../model/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "user already exists" });

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    console.log("tokennnnn->> ", token);

    res.cookie("token", token);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: " internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.logoutUser = async (req, res) => {
  try {
const token = req.cookies?.token;
    if (!token) return res.status(400).json({ message: "No token provided" });
    const decoded = jwt.decode(token);
    const ttl =
      decoded && decoded.exp
        ? decoded.exp - Math.floor(Date.now() / 1000)
        : 60 * 60;
    await redis.set(`Blacklist_${token}`, "1", "EX", ttl > 0 ? ttl : 60 * 60);
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};