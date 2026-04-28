import RepairJob from "../models/RepairJob.js";
import RepairRequest from "../models/RepairRequest.js";
import Service from "../models/Service.js";
import Part from "../models/Part.js";
import Coupon from "../models/Coupon.js";
import Notification from "../models/Notification.js";
import Payment from "../models/Payment.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";
import { sendInvoiceEmail } from "../utils/emailService.js";

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

export const updateJob = async (req, res) => {
  const job = await RepairJob.findById(req.params.id);
  if (!job || job.mechanicId.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Invalid job or unauthorized");
  }

  const { servicesUsed, partsUsed } = req.body;

  if (servicesUsed) {
    const serviceIds = servicesUsed.map((service) => service.serviceId);
    const services = await Service.find({
      _id: { $in: serviceIds },
      isActive: true,
    });
    job.servicesUsed = services.map((service) => ({
      serviceId: service._id,
      name: service.name,
      price: service.basePrice,
    }));
  }

  if (partsUsed) {
    const partIds = partsUsed.map((part) => part.partId);
    const dbParts = await Part.find({ _id: { $in: partIds }, isActive: true });
    job.partsUsed = dbParts.map((dbPart) => {
      const inputPart = partsUsed.find(
        (part) => part.partId.toString() === dbPart._id.toString(),
      );
      return {
        partId: dbPart._id,
        name: dbPart.name,
        price: dbPart.unitPrice,
        quantity: inputPart?.quantity || 1,
      };
    });
  }

  await job.save();
  res.json(job);
};

export const applyCouponToJob = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400);
    throw new Error("Coupon code is required");
  }

  const job = await RepairJob.findById(req.params.id);
  if (!job || job.customerId.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Invalid job or unauthorized");
  }

  if (job.subtotal <= 0) {
    res.status(400);
    throw new Error("Apply coupon after the bill is generated");
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiresAt: { $gt: new Date() },
  });

  if (!coupon || coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("Coupon invalid, expired, or limit reached");
  }

  if (job.subtotal < coupon.minOrderValue) {
    res.status(400);
    throw new Error("Minimum order value not met for this coupon");
  }

  let discountAmount = 0;
  if (coupon.discountType.toLowerCase() === "percentage") {
    discountAmount = (job.subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountCap && discountAmount > coupon.maxDiscountCap) {
      discountAmount = coupon.maxDiscountCap;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  job.couponCode = coupon.code;
  job.discountAmount = discountAmount;
  job.totalCost = job.subtotal - discountAmount;
  await job.save();

  res.json({
    job,
    discountAmount,
    finalAmount: job.totalCost,
  });
};

export const submitBill = async (req, res) => {
  const job = await RepairJob.findById(req.params.id)
    .populate("mechanicId", "name email phone")
    .populate("customerId", "name email phone address")
    .populate("vehicleId", "make model year registrationNumber");

  if (!job || job.mechanicId._id.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Invalid job or unauthorized");
  }

  if (job.billSubmitted) {
    res.status(400);
    throw new Error("Bill already submitted for this job");
  }

  if (job.jobStatus !== "InProgress") {
    res.status(400);
    throw new Error("Job is not ready for billing");
  }

  const servicesTotal = job.servicesUsed.reduce(
    (sum, s) => sum + (s.price || 0),
    0,
  );
  const partsTotal = job.partsUsed.reduce(
    (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
    0,
  );

  if (servicesTotal + partsTotal === 0) {
    res.status(400);
    throw new Error("Please add services and parts before submitting the bill");
  }

  job.subtotal = servicesTotal + partsTotal;
  job.totalCost = job.subtotal - (job.discountAmount || 0);
  job.jobStatus = "PaymentPending";
  job.billSubmitted = true;
  job.completedAt = new Date();
  await job.save();

  // Create Payment record
  const payment = await Payment.create({
    jobId: job._id,
    requestId: job.requestId,
    customerId: job.customerId._id,
    mechanicId: job.mechanicId._id,
    amount: job.totalCost,
    paymentMethod: "Online",
    paymentStatus: "Pending",
  });

  // Generate invoice PDF
  const invoicePDF = await generateInvoicePDF(job, payment);

  // Send invoice email
  await sendInvoiceEmail(job.customerId.email, job, payment, invoicePDF);

  // Create in-app notification
  await Notification.create({
    userId: job.customerId._id,
    message: `Your bill has been generated. Amount to pay: ₹${job.totalCost}. Please proceed to payment.`,
    type: "bill_generated",
  });

  await RepairRequest.findByIdAndUpdate(job.requestId, {
    status: "Completed",
  });

  res.json({
    success: true,
    job,
    payment,
    message: "Bill submitted successfully. Invoice sent to customer.",
  });
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
