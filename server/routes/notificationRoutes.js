import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyNotifications);
router.patch("/read-all", protect, markAllAsRead);
router.patch("/:id", protect, markAsRead);

export default router;
