import express from "express";
import {
  getJobByRequestId,
  addServices,
  addParts,
  submitBill,
  getAllJobs,
  approveCost,
} from "../controllers/jobController.js";
import {
  protect,
  forMechanic,
  forAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:requestId", protect, forMechanic, getJobByRequestId);
router.put("/:id/add-services", protect, forMechanic, addServices);
router.put("/:id/add-parts", protect, forMechanic, addParts);
router.put("/:id/submit-bill", protect, forMechanic, submitBill);

router.get("/admin/all", protect, forAdmin, getAllJobs);
router.put("/admin/:id/approve-cost", protect, forAdmin, approveCost);

export default router;
