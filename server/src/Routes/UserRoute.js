import express from "express";
import {
  getUsers,
  loginUser,
  registerUser,
} from "../Controller/userController.js";
import socketAuth from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getUsers);

export default router;
