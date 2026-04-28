import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllPayments,
  getMechanicEarnings,
} from "../controllers/paymentController.js";
import {
  protect,
  forCustomer,
  forAdmin,
  forApprovedMechanic,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, forCustomer, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/admin/all", protect, forAdmin, getAllPayments);
router.get("/mechanic", protect, forApprovedMechanic, getMechanicEarnings);

export default router;
