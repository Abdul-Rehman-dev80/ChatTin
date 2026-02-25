import express from "express";
import getCalls from "../Controller/callController.js";
import { requireAuth } from "../Middleware/authMiddleware.js";

const router = express.Router()

router.get("/getCalls", requireAuth, getCalls);

export default router;