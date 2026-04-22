import Coupon from "../models/Coupon.js";
import RepairJob from "../models/RepairJob.js";

export const createCoupon = async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderValue,
    maxDiscountCap,
    usageLimit,
    expiresAt,
  } = req.body;
  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrderValue,
    maxDiscountCap,
    usageLimit,
    expiresAt,
  });
  res.status(201).json(coupon);
};

export const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
};

export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  const fields = [
    "code",
    "discountType",
    "discountValue",
    "minOrderValue",
    "maxDiscountCap",
    "usageLimit",
    "expiresAt",
    "isActive",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined)
      coupon[f] = f === "code" ? req.body[f].toUpperCase() : req.body[f];
  });

  const updated = await coupon.save();
  res.json(updated);
};

export const applyCoupon = async (req, res) => {
  const { code, jobId } = req.body;
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });
  if (
    !coupon ||
    coupon.expiresAt < new Date() ||
    coupon.usedCount >= coupon.usageLimit
  ) {
    res.status(400);
    throw new Error("Coupon invalid, expired, or limit reached");
  }

  const job = await RepairJob.findById(jobId);
  if (!job || job.subtotal < coupon.minOrderValue) {
    res.status(400);
    throw new Error("Job not found or min value not met");
  }

  let discountAmount =
    coupon.discountType === "Percentage"
      ? (job.subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscountCap && discountAmount > coupon.maxDiscountCap)
    discountAmount = coupon.maxDiscountCap;

  res.json({
    code: coupon.code,
    discountAmount: Math.round(discountAmount * 100) / 100,
  });
};
