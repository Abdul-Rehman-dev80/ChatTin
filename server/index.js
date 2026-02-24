import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnectionCheck, sequelize } from "./src/Config/dbConfig.js";
import "./src/Model/User.js";
import "./src/Model/Conversation.js";
import "./src/Model/ConversationMember.js";
import "./src/Model/Message.js";
import "./associations.js";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./src/Routes/UserRoute.js";
import socketAuth from "./src/Middleware/authMiddleware.js";
import conversationRouter from "./src/Routes/ConversationRoute.js";
import messageRouter from "./src/Routes/messageRoute.js";
import User from "./src/Model/User.js";
import { registerCallHandlers } from "./src/socket/callHandlers.js";

dotenv.config();

// Check required environment variables
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET environment variable is not set");
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

const PORT = process.env.PORT || 4242;

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", router);
app.use("/api/", conversationRouter);
app.use("/api/", messageRouter);

io.use(socketAuth);

io.on("connection", async (socket) => {
  const userId = socket.user?.userId;
  if (userId) {
    try {
      await User.update({ isOnline: true }, { where: { id: userId } });
    } catch (err) {
      console.error("Status update error:", err);
    }
    // So we can send call events to this user by id (e.g. "user:123")
    socket.join(`user:${userId}`);
    registerCallHandlers(io, socket);
  }
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) socket.join(`conversation:${conversationId}`);
  });
  socket.on("leave_conversation", (conversationId) => {
    if (conversationId) socket.leave(`conversation:${conversationId}`);
  });
  socket.on("disconnect", async () => {
    if (userId) {
      try {
        await User.update(
          { isOnline: false, lastSeen: new Date() },
          { where: { id: userId } },
        );
      } catch (err) {
        console.error("Disconnect status update error:", err);
      }
    }
  });
});

(async function startServer() {
  try {
    await dbConnectionCheck();
    await sequelize.sync({ alter: true });
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`LAN: use http://YOUR_PC_IP:${PORT} from other devices (set CLIENT_URL & VITE_SERVER_URL to that IP)`);
    });
  } catch (error) {
    console.error("Startup error", error);
  }
})();
