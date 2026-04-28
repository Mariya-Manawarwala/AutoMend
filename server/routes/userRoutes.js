import express from "express";
import { getAllUsers, getUserById } from "../controllers/profileController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, forAdmin, getAllUsers);
router.get("/:id", protect, forAdmin, getUserById);

export default router;
