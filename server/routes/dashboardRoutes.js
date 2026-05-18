import express from "express";
import {
  getDashboard,
  updateGarageDetails,
  getMechanics,
  getPendingMechanics,
  approveMechanic,
  rejectMechanic,
  getRevenueStats,
  getSystemHealth,
  getUsers,
  updateUserAccountStatus,
  getActiveJobs,
  getSystemSettings,
  updateSystemSettings
} from "../controllers/dashboardController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, forAdmin, getDashboard);
router.get("/revenue-stats", protect, forAdmin, getRevenueStats);
router.get("/health", protect, forAdmin, getSystemHealth);
router.get("/settings", protect, forAdmin, getSystemSettings);
router.get("/settings/public", getSystemSettings);
router.put("/settings", protect, forAdmin, updateSystemSettings);
router.put("/garage-details", protect, forAdmin, updateGarageDetails);
router.get("/mechanics", protect, forAdmin, getMechanics);
router.get("/mechanics/pending", protect, forAdmin, getPendingMechanics);
router.put("/mechanics/:id/approve", protect, forAdmin, approveMechanic);
router.put("/mechanics/:id/reject", protect, forAdmin, rejectMechanic);

router.get("/users", protect, forAdmin, getUsers);
router.put("/users/:id/account-status", protect, forAdmin, updateUserAccountStatus);
router.get("/active-jobs", protect, forAdmin, getActiveJobs);

export default router;
