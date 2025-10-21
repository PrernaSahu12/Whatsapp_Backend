const express = require("express");
const router = express.Router();
const path = require("path");

const authMiddleware = require(path.join(__dirname, "../middleware/authMiddleware"));
const Message = require(path.join(__dirname, "../models/messageModel"));
const Chat = require(path.join(__dirname, "../models/chatModel"));

// Send message
router.post("/", authMiddleware, async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return res.status(400).json({ message: "Invalid data" });

  try {
    let newMessage = await Message.create({
      sender: req.user.id,
      content,
      chat: chatId,
    });

    newMessage = await newMessage
      .populate("sender", "-password")
      .populate("chat");

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages in a chat
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "-password")
      .populate("chat");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
