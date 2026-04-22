import express from "express";
import {
  getMyProfile,
  updateProfile,
  getAllUsers,
  getUserById,
} from "../controllers/profileController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, upload.single("profilePhoto"), updateProfile);

router.get("/users", protect, forAdmin, getAllUsers);
router.get("/users/:id", protect, forAdmin, getUserById);

export default router;
