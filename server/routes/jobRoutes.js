import express from "express";
import {
  getJobByRequestId,
  updateJob,
  submitBill,
  applyCouponToJob,
  getAllJobs,
} from "../controllers/jobController.js";
import {
  protect,
  forApprovedMechanic,
  forCustomer,
  forAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/all", protect, forAdmin, getAllJobs);
router.get("/:requestId", protect, forApprovedMechanic, getJobByRequestId);
router.patch("/:id", protect, forApprovedMechanic, updateJob);
router.put("/:id/submit-bill", protect, forApprovedMechanic, submitBill);
router.post("/:id/apply-coupon", protect, forCustomer, applyCouponToJob);

export default router;
