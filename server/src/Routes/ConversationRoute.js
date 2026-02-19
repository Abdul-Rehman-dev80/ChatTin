import express from "express";
import { createConversation, listConversations } from "../Controller/conversationController.js";
import { requireAuth } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createConversation);
router.get("/", requireAuth, listConversations);

export default router;