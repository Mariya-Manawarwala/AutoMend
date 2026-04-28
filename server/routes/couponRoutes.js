import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
} from "../controllers/couponController.js";
import { protect, forAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, forAdmin, createCoupon);
router.get("/", protect, forAdmin, getAllCoupons);
router.put("/:id", protect, forAdmin, updateCoupon);

export default router;
