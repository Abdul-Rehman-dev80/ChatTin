import express from "express";
import { getMessages, sendMessage } from "../Controller/messageController.js";
import { requireAuth } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/messages/:conversationId", requireAuth, getMessages);
router.post("/messages", requireAuth, sendMessage);

export default router;