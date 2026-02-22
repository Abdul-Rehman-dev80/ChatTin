import express from "express";
import { createConversation, listConversations } from "../Controller/conversationController.js";
import { requireAuth } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/conversations", requireAuth, createConversation);
router.get("/getConversations", requireAuth, listConversations);

export default router;