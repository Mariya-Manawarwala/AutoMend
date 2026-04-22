import express from "express";
import {
  createRequest,
  getMyRequests,
  getRequestById,
  getAvailableRequests,
  getGarageQueue,
  acceptRequest,
  getMyJobs,
  getAllRequests,
  getRequestByIdAdmin,
  updateRequestStatus,
} from "../controllers/requestController.js";
import {
  protect,
  forCustomer,
  forMechanic,
  forAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, forCustomer, createRequest);
router.get("/my", protect, forCustomer, getMyRequests);
router.get("/available", protect, forMechanic, getAvailableRequests);
router.get("/queue", protect, forMechanic, getGarageQueue);
router.get("/my-jobs", protect, forMechanic, getMyJobs);
router.post("/:id/accept", protect, forMechanic, acceptRequest);
router.get("/:id", protect, getRequestById);

router.get("/admin/all", protect, forAdmin, getAllRequests);
router.get("/admin/:id", protect, forAdmin, getRequestByIdAdmin);
router.put("/admin/:id/status", protect, forAdmin, updateRequestStatus);

export default router;
