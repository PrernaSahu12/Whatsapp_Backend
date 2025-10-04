const dotenv = require("dotenv")
require("dotenv").config();
const app = require("./app")
const http = require("http")
const {Server} = require("socket.io")
const connectDB = require("./config/db")
const cacheClient = require("./services/cache.service")
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");




const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin : "http://localhost:5173",
        methods:["Get","Post"]
    }
})

io.on("connection",(socket)=>{
    console.log("A user connected:", socket.id)
    


socket.on("joinRoom", (roomId)=>{
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`)
});


socket.on("sendMessage", (data)=>{
    const {chatId, sender,text} = data;
    socket.to(chatId).emit("receiveMessage", data)
});

socket.on("typing",(roomId)=>{
    socket.to(roomId).emit("typing")
});

socket.on("stopTyping",(roomId)=>{
    socket.to(roomId).emit("stopTyping")
});

socket.on("disConnect",()=>{
    console.log("User disconnected:", socket.id)
});

})

app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

connectDB().then(()=>{
   server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
}) 
})


