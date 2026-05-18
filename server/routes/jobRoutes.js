import express from "express";
import {
  getJobByRequestId,
  updateJob,
  submitBill,
  getAllJobs,
  getMyJobs,
  updateJobStatus,
  updateMechanicLocation,
  getJobById,
  getMechanicEarnings,
  generateFinalInvoice,
} from "../controllers/jobController.js";
import {
  protect,
  forApprovedMechanic,
  forCustomer,
  forAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/all", protect, forAdmin, getAllJobs);
router.get("/my", protect, forApprovedMechanic, getMyJobs);
router.get("/request/:requestId", protect, forApprovedMechanic, getJobByRequestId);
router.patch("/:id", protect, forApprovedMechanic, updateJob);
router.patch("/:id/status", protect, updateJobStatus);
router.patch("/:id/location", protect, forApprovedMechanic, updateMechanicLocation);
router.get("/mechanic/earnings", protect, forApprovedMechanic, getMechanicEarnings);
router.get("/:id", protect, getJobById);
router.post("/:id/generate-invoice", protect, forApprovedMechanic, generateFinalInvoice);
router.put("/:id/submit-bill", protect, forApprovedMechanic, submitBill);

export default router;
