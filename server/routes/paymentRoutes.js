import express from "express";
import {
  createPayment,
  mechanicConfirmPayment,
  adminRecordPayment,
  settleWallet,
  getAllPayments,
} from "../controllers/paymentController.js";
import {
  protect,
  forCustomer,
  forMechanic,
  forAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId/pay", protect, forCustomer, createPayment);
router.put(
  "/:id/mechanic-confirm",
  protect,
  forMechanic,
  mechanicConfirmPayment,
);

router.get("/admin/all", protect, forAdmin, getAllPayments);
router.put("/admin/:id/record", protect, forAdmin, adminRecordPayment);
router.put(
  "/admin/mechanics/:id/settle-wallet",
  protect,
  forAdmin,
  settleWallet,
);

export default router;
