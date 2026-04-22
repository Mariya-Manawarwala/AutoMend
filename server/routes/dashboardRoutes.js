import express from "express";
import {
  getDashboardStats,
  getGarageDetails,
  updateGarageDetails,
  getMechanics,
} from "../controllers/dashboardController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, forAdmin, getDashboardStats);
router.get("/garage-details", protect, forAdmin, getGarageDetails);
router.put("/garage-details", protect, forAdmin, updateGarageDetails);
router.get("/mechanics", protect, forAdmin, getMechanics);

export default router;
