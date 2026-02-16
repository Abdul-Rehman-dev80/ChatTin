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

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4242;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/api", router);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);


  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
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
