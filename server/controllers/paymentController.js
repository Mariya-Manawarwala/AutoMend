import { razorpay, getRazorpayConfig } from "../config/razorpay.js";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import RepairJob from "../models/RepairJob.js";
import RepairRequest from "../models/RepairRequest.js";
import TransactionLog from "../models/TransactionLog.js";
import Notification from "../models/Notification.js";
import { notifyAdmins } from "../utils/adminNotifier.js";

/**
 * @desc    Create a new Razorpay Order
 * @route   POST /api/payments/create-order
 * @access  Private (Customer)
 */
export const createOrder = async (req, res) => {
  const { jobId, requestId } = req.body;

  try {
    // 1. Validate Job & Ownership
    let job;
    if (jobId) {
      job = await RepairJob.findById(jobId).populate("customerId");
    } else if (requestId) {
      job = await RepairJob.findOne({ requestId }).populate("customerId");
    }

    if (!job || job.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized or invalid job" });
    }

    // 2. Validate Payable State
    const validStatuses = ["PaymentPending", "awaiting_payment", "Accepted", "InProgress", "Completed"];
    if (!validStatuses.includes(job.jobStatus)) {
      return res.status(400).json({ message: `Job is not in a payable state (${job.jobStatus})` });
    }

    if (job.totalCost <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    // 3. Prevent Duplicate Pending Orders by updating existing payment
    let existingPayment = await Payment.findOne({ 
      jobId: job._id, 
      paymentStatus: { $in: ["created", "pending", "Pending"] } 
    });

    if (existingPayment && existingPayment.orderId) {
      return res.status(200).json({
        success: true,
        orderId: existingPayment.orderId,
        amount: existingPayment.amount * 100,
        key: getRazorpayConfig().key
      });
    }

    // 4. Create Razorpay Order
    const amountInPaise = Math.round(job.totalCost * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${job._id.toString().slice(-6)}`,
      notes: {
        jobId: job._id.toString(),
        customerId: req.user._id.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 5. Save or Update Internal Payment Record
    let payment;
    if (existingPayment) {
      existingPayment.orderId = razorpayOrder.id;
      existingPayment.paymentStatus = "created";
      payment = await existingPayment.save();
    } else {
      payment = await Payment.create({
        jobId: job._id,
        requestId: job.requestId,
        customerId: req.user._id,
        mechanicId: job.mechanicId,
        amount: job.totalCost,
        orderId: razorpayOrder.id,
        paymentStatus: "created"
      });
    }

    // 6. Log the event
    await TransactionLog.create({
      paymentId: payment._id,
      jobId: job._id,
      userId: req.user._id,
      event: "order_created",
      status: "success",
      rawResponse: razorpayOrder
    });

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: getRazorpayConfig().key,
      message: "Order created successfully"
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Failed to initialize payment gateway" });
  }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payments/verify
 * @access  Private (Customer)
 */
export const verifyPayment = async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature 
  } = req.body;

  try {
    // 1. Signature Verification
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    const isVerified = generatedSignature === razorpay_signature;

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (!isVerified) {
      // LOG FRAUD ATTEMPT
      await TransactionLog.create({
        paymentId: payment._id,
        jobId: payment.jobId,
        userId: req.user._id,
        event: "fraud_detected",
        status: "failure",
        message: "Invalid signature received"
      });
      
      payment.paymentStatus = "suspicious";
      await payment.save();
      
      return res.status(400).json({ success: false, message: "Fraud detected: Invalid signature" });
    }

    // 2. Prevent Duplicate Processing
    if (payment.paymentStatus === "completed") {
      return res.status(200).json({ success: true, message: "Payment already verified" });
    }

    // 3. Update Database (Atomic Update)
    payment.paymentStatus = "completed";
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.paidAt = new Date();
    await payment.save();

    const job = await RepairJob.findById(payment.jobId);
    if (job) {
      job.jobStatus = "paid";
      job.paymentStatus = "paid";
      job.completedAt = new Date();
      await job.save();
    }

    // 4. Update Request
    await RepairRequest.findByIdAndUpdate(payment.requestId, { status: "Completed" });

    // 5. Notifications
    await Notification.create({
      userId: payment.customerId,
      message: `Payment of ₹${payment.amount} successful! Your vehicle service is now complete.`,
      type: "payment_success"
    });

    // 6. Log Success
    await TransactionLog.create({
      paymentId: payment._id,
      jobId: payment.jobId,
      userId: req.user._id,
      event: "payment_verified",
      status: "success",
      message: "Payment signature verified and records updated"
    });

    res.status(200).json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Internal verification error" });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    // Self-healing: Scan all active jobs for the customer and heal any missing payment records
    const jobs = await RepairJob.find({ customerId: req.user._id });
    const existingPayments = await Payment.find({ customerId: req.user._id });
    const existingJobIds = new Set(existingPayments.map(p => p.jobId.toString()));

    for (const job of jobs) {
      if (!existingJobIds.has(job._id.toString())) {
        if (job.jobStatus === "PaymentPending" || job.jobStatus === "paid" || job.paymentStatus === "paid") {
          const status = (job.jobStatus === "paid" || job.paymentStatus === "paid") ? "completed" : "pending";
          await Payment.create({
            jobId: job._id,
            requestId: job.requestId,
            customerId: req.user._id,
            mechanicId: job.mechanicId?._id || job.mechanicId,
            amount: job.totalCost || 0,
            paymentMethod: "Online",
            paymentStatus: status,
            paidAt: status === "completed" ? (job.completedAt || new Date()) : undefined
          });
        }
      }
    }

    const payments = await Payment.find({ customerId: req.user._id })
      .populate({
        path: "jobId",
        populate: { path: "vehicleId" },
      })
      .populate("mechanicId", "name")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    // Self-healing: Scan all active jobs globally and heal any missing payment records
    const jobs = await RepairJob.find({});
    const existingPayments = await Payment.find({});
    const existingJobIds = new Set(existingPayments.map(p => p.jobId.toString()));

    for (const job of jobs) {
      if (!existingJobIds.has(job._id.toString())) {
        if (job.jobStatus === "PaymentPending" || job.jobStatus === "paid" || job.paymentStatus === "paid") {
          const status = (job.jobStatus === "paid" || job.paymentStatus === "paid") ? "completed" : "pending";
          await Payment.create({
            jobId: job._id,
            requestId: job.requestId,
            customerId: job.customerId,
            mechanicId: job.mechanicId,
            amount: job.totalCost || 0,
            paymentMethod: "Online",
            paymentStatus: status,
            paidAt: status === "completed" ? (job.completedAt || new Date()) : undefined
          });
        }
      }
    }

    const payments = await Payment.find({})
      .populate("customerId", "name email")
      .populate("mechanicId", "name")
      .populate("jobId")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMechanicEarnings = async (req, res) => {
  const mechanicId = req.user._id;
  const { month, year } = req.query;

  const jobs = await RepairJob.find({
    mechanicId,
    jobStatus: "paid",
  }).select("_id");

  const jobIds = jobs.map((job) => job._id);

  const dateFilter = {};
  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    dateFilter.createdAt = { $gte: start, $lte: end };
  }

  const payments = await Payment.find({
    jobId: { $in: jobIds },
    paymentStatus: "completed",
    ...dateFilter,
  })
    .populate({
      path: "jobId",
      select: "vehicle description totalCost createdAt",
    })
    .sort({ createdAt: -1 });

  const earnings = payments
    .filter((payment) => payment.jobId)
    .map((payment) => ({
      paymentId: payment._id,
      jobId: payment.jobId._id,
      vehicle: payment.jobId.vehicle,
      description: payment.jobId.description,
      amount: payment.amount,
      date: payment.createdAt,
    }));

  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);

  res.status(200).json({
    success: true,
    totalEarnings,
    count: earnings.length,
    earnings,
  });
};

export const getPaymentBreakdown = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("customerId", "name phone address")
      .populate("mechanicId", "name")
      .populate({
        path: "jobId",
        populate: [{ path: "vehicleId" }],
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.customerId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({
      success: true,
      payment,
      job: payment.jobId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("customerId", "name phone address")
      .populate("mechanicId", "name")
      .populate({
        path: "jobId",
        populate: [{ path: "vehicleId" }],
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    // Auth check for invoice download
    if (req.user && payment.customerId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { generateInvoicePDF } = await import("../utils/invoiceGenerator.js");
    const job = payment.jobId;
    const filePath = await generateInvoicePDF(job, payment);

    res.download(filePath, `invoice_${payment._id.toString().slice(-8)}.pdf`);
  } catch (error) {
    console.error("Invoice Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
