const express = require("express");
const router = express.Router();
const path = require("path");

const authMiddleware = require(path.join(__dirname, "../middleware/authMiddleware"));
const Message = require(path.join(__dirname, "../models/messageModel"));
const Chat = require(path.join(__dirname, "../models/chatModel"));


router.post("/", authMiddleware, async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Content and chatId are required." });
  }

  try {
    // Create message
    let newMessage = await Message.create({
      sender: req.user.id,
      content,
      chat: chatId,
    });

    // Populate sender & chat details
    newMessage = await newMessage
      .populate("sender", "-password")
      .populate("chat");

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:chatId", authMiddleware, async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "-password")
      .populate("chat");

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
