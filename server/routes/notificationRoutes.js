import express from "express";
import {
  getMyNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyNotifications);
router.patch("/:id", protect, markAsRead);

export default router;
