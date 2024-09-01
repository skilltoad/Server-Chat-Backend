const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const messageModel = require("./model/messageModel");

const app = express();
const socket = require("socket.io");
require("dotenv").config();
app.use(cors({
  origin: 'https://server-chat-echo.vercel.app',
  methods: ["POST","GET"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: 'https://server-chat-echo.vercel.app',
    credentials: true,
  },
});
const SERVER_ID = "66d1b09431a24fcdfad58911";
global.onlineUsers = new Map();
onlineUsers.set(SERVER_ID, "server-socket-id");
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    // io.emit("msg-recieve", data.message);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
