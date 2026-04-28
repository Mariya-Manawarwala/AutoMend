import express from "express";
import {
  getDashboard,
  updateGarageDetails,
  getMechanics,
  getPendingMechanics,
  approveMechanic,
  rejectMechanic,
} from "../controllers/dashboardController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, forAdmin, getDashboard);
router.put("/garage-details", protect, forAdmin, updateGarageDetails);
router.get("/mechanics", protect, forAdmin, getMechanics);
router.get("/mechanics/pending", protect, forAdmin, getPendingMechanics);
router.put("/mechanics/:id/approve", protect, forAdmin, approveMechanic);
router.put("/mechanics/:id/reject", protect, forAdmin, rejectMechanic);

export default router;
