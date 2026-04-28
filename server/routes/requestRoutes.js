import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  acceptRequest,
} from "../controllers/requestController.js";
import {
  protect,
  forCustomer,
  forApprovedMechanic,
} from "../middleware/authMiddleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.post(
  "/",
  protect,
  forCustomer,
  upload.single("vehicleImage"),
  createRequest,
);
router.get("/", protect, getRequests);
router.post("/:id/accept", protect, forApprovedMechanic, acceptRequest);
router.get("/:id", protect, getRequestById);

export default router;
