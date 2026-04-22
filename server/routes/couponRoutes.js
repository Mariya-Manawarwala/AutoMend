import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  applyCoupon,
} from "../controllers/couponController.js";
import {
  protect,
  forAdmin,
  forCustomer,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, forAdmin, createCoupon);
router.get("/", protect, forAdmin, getAllCoupons);
router.put("/:id", protect, forAdmin, updateCoupon);
router.post("/apply", protect, forCustomer, applyCoupon);

export default router;
