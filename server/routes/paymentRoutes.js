import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllPayments,
  getMechanicEarnings,
  getMyPayments,
  getPaymentBreakdown,
  downloadInvoice,
} from "../controllers/paymentController.js";
import { handleWebhook } from "../controllers/webhookController.js";
import {
  protect,
  forCustomer,
  forAdmin,
  forApprovedMechanic,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, forCustomer, createOrder);
router.post("/verify", protect, forCustomer, verifyPayment);
router.post("/webhook", handleWebhook); // Public but verified by signature
router.get("/my", protect, forCustomer, getMyPayments);
router.get("/:id/breakdown", protect, forCustomer, getPaymentBreakdown);
router.get("/:id/invoice", protect, downloadInvoice);
router.get("/admin/all", protect, forAdmin, getAllPayments);
router.get("/mechanic", protect, forApprovedMechanic, getMechanicEarnings);

export default router;
