import express from "express";
import { getAllUsers, loginUser, registerUser, searchUser } from "../Controller/userController.js";
import socketAuth from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/getAllUsers", getAllUsers);
router.post("/searchUser", searchUser);

export default router;