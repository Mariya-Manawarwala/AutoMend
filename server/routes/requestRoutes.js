import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  acceptRequest,
  approveRequest,
  rejectRequest,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController.js";
import {
  protect,
  forCustomer,
  forAdmin,
  forApprovedMechanic,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Specific routes first
router.get("/my", protect, forCustomer, getRequests);
router.get("/available", protect, forApprovedMechanic, getRequests);

// Generic routes
router.post(
  "/",
  protect,
  forCustomer,
  upload.single("vehicleImage"),
  createRequest,
);

router.get("/", protect, getRequests);
router.post("/:id/accept", protect, forApprovedMechanic, acceptRequest);
router.post("/:id/approve", protect, forAdmin, approveRequest);
router.post("/:id/reject", protect, forAdmin, rejectRequest);
router.put("/:id", protect, forCustomer, upload.single("vehicleImage"), updateRequest);
router.delete("/:id", protect, forCustomer, deleteRequest);
router.get("/:id", protect, getRequestById);

export default router;
