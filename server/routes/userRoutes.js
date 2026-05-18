import express from "express";
import { getAllUsers, getUserById, getPublicMechanicById, getPublicMechanics } from "../controllers/profileController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no auth needed)
router.get("/mechanics/public", getPublicMechanics);
router.get("/mechanic/:id", getPublicMechanicById);

// Admin-only
router.get("/", protect, forAdmin, getAllUsers);
router.get("/:id", protect, forAdmin, getUserById);

export default router;
