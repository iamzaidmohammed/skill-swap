const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/skills", require("./routes/skill"));
app.use("/api/requests", require("./routes/request"));
app.use("/api/notifications", require("./routes/notification"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });

// map userId -> socket id(s)
const userSockets = new Map();

io.on("connection", (socket) => {
  const token = socket.handshake.auth?.token;
  if (!token) return;
  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.user?.id || decoded?.id || decoded?._id;
    if (!userId) return;
    const list = userSockets.get(userId) || new Set();
    list.add(socket.id);
    userSockets.set(userId, list);

    socket.on("disconnect", () => {
      const s = userSockets.get(userId);
      if (s) {
        s.delete(socket.id);
        if (s.size === 0) userSockets.delete(userId);
      }
    });
  } catch (e) {
    console.log("Socket auth error:", e.message);
  }
});

// helper to emit notification to a user
app.locals.emitNotification = (userId, payload) => {
  const s = userSockets.get(userId);
  if (!s) return;
  for (const sid of s) {
    io.to(sid).emit("notification", payload);
  }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
