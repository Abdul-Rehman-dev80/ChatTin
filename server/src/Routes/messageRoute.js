import express from "express";
import { getMessages } from "../Controller/messageController.js";

const router = express.Router();

router.get("/messages/:conversationId", getMessages);

export default router;