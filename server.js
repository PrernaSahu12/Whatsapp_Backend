const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app"); // ✅ app.js inside src
const connectDB = require("./src/config/db");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    socket.to(data.chatId).emit("receiveMessage", data);
  });

  socket.on("typing", (roomId) => socket.to(roomId).emit("typing"));
  socket.on("stopTyping", (roomId) => socket.to(roomId).emit("stopTyping"));

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// Connect DB and start server
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
