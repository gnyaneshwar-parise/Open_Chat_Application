const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO SETUP ================= */
/* (CORS added for ngrok / multi-network access) */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

/* ================= FRONTEND FILES ================= */
// Serve frontend files
app.use(express.static(path.join(__dirname, "uiLayer")));

// Serve main UI page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "uiLayer", "homeView.html"));
});

/* ================= SOCKET LOGIC ================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // New user joins
  socket.on("new-user", (username) => {
    socket.username = username;
    socket.broadcast.emit("message", `${username} joined the chat`);
  });

  // Chat message
  socket.on("chat-message", (msg) => {
    io.emit("message", `${socket.username}: ${msg}`);
  });

  // User disconnects
  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("message", `${socket.username} left the chat`);
    }
  });
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`RTRP Server running on port ${PORT}`);
});
