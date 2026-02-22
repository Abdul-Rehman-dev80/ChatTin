import express from "express";
import { getMessages } from "../Controller/messageController.js";
import { requireAuth } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/messages/:conversationId", requireAuth, getMessages);

export default router;