import express from "express";
import {
  getMyProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, upload.single("profilePhoto"), updateProfile);
router.delete("/delete", protect, deleteAccount);

export default router;
