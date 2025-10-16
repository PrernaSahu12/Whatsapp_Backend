const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../model/chatModel");
const User = require("../model/models");

// Create or fetch one-on-one chat
router.post("/", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "UserId required" });

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user.id, userId] },
  }).populate("users", "-password");

  if (chat) return res.json(chat);

  const newChat = await Chat.create({
    chatName: "sender",
    isGroupChat: false,
    users: [req.user.id, userId],
  });

  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
  res.status(201).json(fullChat);
});

// Fetch all chats of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const chats = await Chat.find({ users: { $in: [req.user.id] } })
    .populate("users", "-password")
    .populate("latestMessage");
  res.json(chats);
});

module.exports = router;
