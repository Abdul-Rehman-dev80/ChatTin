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

dotenv.config();

// Check required environment variables
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET environment variable is not set");
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

const PORT = process.env.PORT || 4242;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", router);
app.use("/api/", conversationRouter);
app.use("/api/", messageRouter);

io.use(socketAuth);

io.on("connection", (socket) => {
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) socket.join(`conversation:${conversationId}`);
  });
  socket.on("leave_conversation", (conversationId) => {
    if (conversationId) socket.leave(`conversation:${conversationId}`);
  });
  socket.on("disconnect", () => {});
});

(async function startServer() {
  try {
    await dbConnectionCheck();
    await sequelize.sync({ alter: true });
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error", error);
  }
})();
