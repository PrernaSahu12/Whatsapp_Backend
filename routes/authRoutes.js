const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const  authMiddleware = require("../middleware/authMiddleware");

const router = express.Router()



router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", require("../controllers/authController").logoutUser)

module.exports = router;