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
