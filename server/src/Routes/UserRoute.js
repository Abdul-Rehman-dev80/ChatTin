import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getMe,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  updateProfile,
  uploadAvatar,
} from "../Controller/userController.js";
import { requireAuth } from "../Middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/profiles"));
  },
  filename: (req, file, cb) => {
    cb(null, `temp_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateProfile);
router.post("/me/avatar", requireAuth, upload.single("avatar"), uploadAvatar);
router.get("/getUserById/:id", getUserById);
router.get("/users", getUsers);

export default router;
