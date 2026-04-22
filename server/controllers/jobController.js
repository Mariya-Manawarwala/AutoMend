import RepairJob from "../models/RepairJob.js";
import RepairRequest from "../models/RepairRequest.js";
import Service from "../models/Service.js";
import Part from "../models/Part.js";
import Coupon from "../models/Coupon.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const getJobByRequestId = async (req, res) => {
  const job = await RepairJob.findOne({ requestId: req.params.requestId })
    .populate("requestId")
    .populate("vehicleId")
    .populate("customerId", "name phone address fullName");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json(job);
};

export const addServices = async (req, res) => {
  const job = await RepairJob.findById(req.params.id);
  if (!job || job.mechanicId.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Invalid job or unauthorized");
  }

  const { serviceIds } = req.body;
  if (!serviceIds) {
    res.status(400);
    throw new Error("Provide service IDs");
  }

  const services = await Service.find({
    _id: { $in: serviceIds },
    isActive: true,
  });
  job.servicesUsed = services.map((s) => ({
    serviceId: s._id,
    name: s.name,
    price: s.price,
  }));
  await job.save();
  res.json(job);
};

export const addParts = async (req, res) => {
  const job = await RepairJob.findById(req.params.id);
  if (!job || job.mechanicId.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Invalid job or unauthorized");
  }

  const { parts } = req.body;
  if (!parts) {
    res.status(400);
    throw new Error("Provide parts");
  }

  const partIds = parts.map((p) => p.partId);
  const dbParts = await Part.find({ _id: { $in: partIds }, isActive: true });

  job.partsUsed = dbParts.map((dbP) => {
    const input = parts.find((p) => p.partId === dbP._id.toString());
    return {
      partId: dbP._id,
      name: dbP.name,
      price: dbP.price,
      quantity: input?.quantity || 1,
    };
  });
  await job.save();
  res.json(job);
};

export const submitBill = async (req, res) => {
  const job = await RepairJob.findById(req.params.id);
  if (
    !job ||
    job.mechanicId.toString() !== req.user._id.toString() ||
    job.jobStatus !== "InProgress"
  ) {
    res.status(400);
    throw new Error("Invalid job, unauthorized, or not in progress");
  }

  const { laborCost, couponCode } = req.body;
  if (laborCost !== undefined) job.laborCost = laborCost;

  const servicesTotal = job.servicesUsed.reduce((sum, s) => sum + s.price, 0);
  const partsTotal = job.partsUsed.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );
  job.subtotal = servicesTotal + partsTotal + job.laborCost;

  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
    if (
      coupon &&
      coupon.usedCount < coupon.usageLimit &&
      job.subtotal >= coupon.minOrderValue
    ) {
      if (coupon.discountType === "Percentage") {
        discount = (job.subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap)
          discount = coupon.maxDiscountCap;
      } else {
        discount = coupon.discountValue;
      }
      coupon.usedCount += 1;
      await coupon.save();
      job.couponCode = coupon.code;
    }
  }

  job.discountAmount = discount;
  job.totalCost = job.subtotal - discount;
  job.jobStatus = "BillSubmitted";
  await job.save();

  await RepairRequest.findByIdAndUpdate(job.requestId, {
    status: "WaitingForAdminReview",
  });

  const admins = await User.find({ role: "admin" });
  const notifs = admins.map((a) => ({
    userId: a._id,
    message: `Mechanic submitted bill for ₹${job.totalCost}`,
    type: "bill_submitted",
  }));
  if (notifs.length) await Notification.insertMany(notifs);

  res.json(job);
};

export const getAllJobs = async (req, res) => {
  const jobs = await RepairJob.find({})
    .populate("requestId")
    .populate("mechanicId")
    .populate("customerId")
    .populate("vehicleId")
    .sort({ createdAt: -1 });
  res.json(jobs);
};

export const approveCost = async (req, res) => {
  const { adminApprovedCost } = req.body;
  const job = await RepairJob.findById(req.params.id);
  if (!job || job.jobStatus !== "BillSubmitted") {
    res.status(400);
    throw new Error("Invalid job or not ready for approval");
  }

  job.adminApprovedCost =
    adminApprovedCost !== undefined ? adminApprovedCost : job.totalCost;
  job.jobStatus = "PaymentPending";
  await job.save();

  await RepairRequest.findByIdAndUpdate(job.requestId, { status: "Approved" });

  await Notification.insertMany([
    {
      userId: job.mechanicId,
      message: `Bill approved for ₹${job.adminApprovedCost}`,
    },
    {
      userId: job.customerId,
      message: `Bill approved. Amount to pay: ₹${job.adminApprovedCost}`,
    },
  ]);

  res.json(job);
};
