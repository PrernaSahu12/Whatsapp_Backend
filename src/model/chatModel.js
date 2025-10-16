const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  chatName: { type: String, required: function() { return this.isGroupChat; } },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
