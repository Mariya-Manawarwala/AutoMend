import Payment from "../models/Payment.js";
import RepairJob from "../models/RepairJob.js";
import RepairRequest from "../models/RepairRequest.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createPayment = async (req, res) => {
  const job = await RepairJob.findById(req.params.jobId);
  if (
    !job ||
    job.jobStatus !== "PaymentPending" ||
    job.customerId.toString() !== req.user._id.toString()
  ) {
    res.status(400);
    throw new Error("Invalid job or not authorized");
  }

  const { paymentMethod, note } = req.body;
  const amount = job.adminApprovedCost;

  let paymentStatus = "Pending";
  let paidAt = null;

  if (paymentMethod === "Online") {
    paymentStatus = "Completed";
    paidAt = new Date();
    job.jobStatus = "PaymentConfirmed";
    await job.save();
    await RepairRequest.findByIdAndUpdate(job.requestId, {
      status: "Completed",
    });
    await Notification.create({
      userId: req.user._id,
      message: `Payment of ₹${amount} successful.`,
    });
    await Notification.create({
      userId: job.mechanicId,
      message: `Online payment received.`,
    });
  }

  const payment = await Payment.create({
    jobId: job._id,
    requestId: job.requestId,
    customerId: req.user._id,
    mechanicId: job.mechanicId,
    amount,
    paymentMethod,
    paymentStatus,
    paidAt,
    note: note || "",
  });

  res.status(201).json(payment);
};

export const mechanicConfirmPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment || payment.mechanicId.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Payment not found or unauthorized");
  }

  payment.paymentStatus = "MechanicConfirmed";
  payment.mechanicConfirmedAt = new Date();
  await payment.save();

  if (payment.paymentMethod === "Cash") {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "mechanicWallet.dueBalance": payment.amount },
    });
  }

  await Notification.create({
    userId: payment.customerId,
    message: `Mechanic confirmed your ₹${payment.amount} payment.`,
  });
  res.json(payment);
};

export const adminRecordPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  payment.paymentStatus = "Completed";
  payment.paidAt = new Date();
  await payment.save();

  const job = await RepairJob.findById(payment.jobId);
  if (job) {
    job.jobStatus = "Completed";
    job.completedAt = new Date();
    await job.save();
  }
  await RepairRequest.findByIdAndUpdate(payment.requestId, {
    status: "Completed",
  });

  await Notification.create({
    userId: payment.customerId,
    message: `Cash payment recorded.`,
  });
  res.json(payment);
};

export const settleWallet = async (req, res) => {
  const mechanic = await User.findById(req.params.id);
  if (!mechanic || mechanic.role !== "mechanic") {
    res.status(404);
    throw new Error("Mechanic not found");
  }

  mechanic.mechanicWallet.dueBalance = 0;
  await mechanic.save();

  await Notification.create({
    userId: mechanic._id,
    message: `Your wallet balance was settled by admin.`,
  });
  res.json(mechanic);
};

export const getAllPayments = async (req, res) => {
  const payments = await Payment.find({})
    .populate("customerId")
    .populate("mechanicId")
    .populate("jobId")
    .sort({ createdAt: -1 });
  res.json(payments);
};
