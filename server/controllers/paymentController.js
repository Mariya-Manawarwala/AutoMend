import Payment from "../models/Payment.js";
import RepairJob from "../models/RepairJob.js";
import RepairRequest from "../models/RepairRequest.js";
import Coupon from "../models/Coupon.js";
import Notification from "../models/Notification.js";

export const createOrder = async (req, res) => {
  const job = await RepairJob.findById(req.body.jobId || req.params.jobId);
  if (
    !job ||
    job.jobStatus !== "PaymentPending" ||
    job.customerId.toString() !== req.user._id.toString()
  ) {
    res.status(400);
    throw new Error("Invalid job or not authorized");
  }

  if (job.totalCost <= 0) {
    res.status(400);
    throw new Error(
      "Job total amount must be calculated before creating an order",
    );
  }

  const orderId = `order_${job._id}_${Date.now()}`;
  const payment = await Payment.create({
    jobId: job._id,
    requestId: job.requestId,
    customerId: req.user._id,
    mechanicId: job.mechanicId,
    amount: job.totalCost,
    paymentMethod: "Online",
    paymentStatus: "Pending",
    orderId,
    note: req.body.note || "",
  });

  res.status(201).json({
    payment,
    orderId,
    amount: payment.amount,
    message: "Order created, ready for verification",
  });
};

export const verifyPayment = async (req, res) => {
  const { orderId, paymentId } = req.body;
  if (!orderId || !paymentId) {
    res.status(400);
    throw new Error("orderId and paymentId are required");
  }

  const payment = await Payment.findOne({ orderId });
  if (!payment || payment._id.toString() !== paymentId) {
    res.status(404);
    throw new Error("Payment not found");
  }

  if (payment.paymentStatus === "Completed") {
    return res.json(payment);
  }

  payment.paymentStatus = "Completed";
  payment.paidAt = new Date();
  await payment.save();

  const job = await RepairJob.findById(payment.jobId);
  if (job) {
    job.jobStatus = "Completed";
    job.completedAt = new Date();
    await job.save();

    if (job.couponCode) {
      const coupon = await Coupon.findOne({ code: job.couponCode });
      if (coupon && coupon.usedCount < coupon.usageLimit) {
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  await RepairRequest.findByIdAndUpdate(payment.requestId, {
    status: "Completed",
  });

  await Notification.insertMany([
    {
      userId: payment.customerId,
      message: `Payment of ₹${payment.amount} verified successfully.`,
      type: "payment_success",
    },
    {
      userId: payment.mechanicId,
      message: `Payment of ₹${payment.amount} has been completed.`,
      type: "payment_received",
    },
  ]);

  res.json(payment);
};

export const getMechanicEarnings = async (req, res) => {
  const mechanicId = req.user._id;
  const { month, year } = req.query;

  const jobs = await RepairJob.find({
    mechanicId,
    jobStatus: "Completed",
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
    paymentStatus: "Completed",
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

export const getAllPayments = async (req, res) => {
  const payments = await Payment.find({})
    .populate("customerId")
    .populate("mechanicId")
    .populate("jobId")
    .sort({ createdAt: -1 });
  res.json(payments);
};
