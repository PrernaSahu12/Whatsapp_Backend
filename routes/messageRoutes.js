const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../model/messageModel");
const Chat = require("../model/chatModel");

// Send message
router.post("/", authMiddleware, async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return res.status(400).json({ message: "Invalid data" });

  let newMessage = await Message.create({
    sender: req.user.id,
    content,
    chat: chatId,
  });

  newMessage = await newMessage.populate("sender", "-password").populate("chat");
  await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

  res.status(201).json(newMessage);
});

// Get all messages in a chat
router.get("/:chatId", authMiddleware, async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "-password")
    .populate("chat");
  res.json(messages);
});

module.exports = router;
