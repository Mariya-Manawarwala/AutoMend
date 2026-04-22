import RepairJob from "../models/RepairJob.js";
import Payment from "../models/Payment.js";

export const getCustomerHistory = async (req, res) => {
  const jobs = await RepairJob.find({
    customerId: req.user._id,
    jobStatus: "Completed",
  })
    .populate("vehicleId")
    .populate("requestId")
    .sort({ completedAt: -1 });

  const payments = await Payment.find({
    customerId: req.user._id,
    paymentStatus: "Completed",
  });

  const history = jobs.map((job) => {
    const payment = payments.find(
      (p) => p.jobId.toString() === job._id.toString(),
    );
    return {
      jobId: job._id,
      vehicle: job.vehicleId,
      problem: job.requestId?.problemDescription,
      servicesUsed: job.servicesUsed,
      partsUsed: job.partsUsed,
      totalPaid: job.adminApprovedCost || job.totalCost,
      paymentMethod: payment?.paymentMethod || "N/A",
      dateCompleted: job.completedAt,
    };
  });
  res.json(history);
};

export const getMechanicHistory = async (req, res) => {
  const jobs = await RepairJob.find({
    mechanicId: req.user._id,
    jobStatus: "Completed",
  })
    .populate("vehicleId")
    .sort({ completedAt: -1 });

  const payments = await Payment.find({
    mechanicId: req.user._id,
    paymentStatus: "Completed",
  });

  const history = jobs.map((job) => {
    const payment = payments.find(
      (p) => p.jobId.toString() === job._id.toString(),
    );
    return {
      jobId: job._id,
      vehicle: job.vehicleId,
      servicesPerformed: job.servicesUsed,
      partsUsed: job.partsUsed,
      earnings: payment?.amount || job.adminApprovedCost || job.totalCost,
      dateCompleted: job.completedAt,
    };
  });
  res.json(history);
};

export const getAdminHistory = async (req, res) => {
  const jobs = await RepairJob.find({ jobStatus: "Completed" })
    .populate("vehicleId")
    .populate("customerId")
    .populate("mechanicId")
    .populate("requestId")
    .sort({ completedAt: -1 });

  const payments = await Payment.find({ paymentStatus: "Completed" });

  const history = jobs.map((job) => {
    const payment = payments.find(
      (p) => p.jobId.toString() === job._id.toString(),
    );
    return {
      jobId: job._id,
      customer: job.customerId,
      mechanic: job.mechanicId,
      vehicle: job.vehicleId,
      problem: job.requestId?.problemDescription,
      totalCost: job.totalCost,
      paymentMethod: payment?.paymentMethod || "N/A",
      dateCompleted: job.completedAt,
    };
  });
  res.json(history);
};
