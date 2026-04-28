import RepairJob from "../models/RepairJob.js";
import Payment from "../models/Payment.js";

export const getHistory = async (req, res) => {
  let jobs;
  let payments;

  if (req.user.role === "customer") {
    jobs = await RepairJob.find({
      customerId: req.user._id,
      jobStatus: "Completed",
    })
      .populate("vehicleId")
      .populate("requestId")
      .sort({ completedAt: -1 });

    payments = await Payment.find({
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
        totalPaid: payment?.amount || job.totalCost,
        paymentMethod: payment?.paymentMethod || "N/A",
        dateCompleted: job.completedAt,
      };
    });

    return res.json(history);
  }

  if (req.user.role === "mechanic") {
    jobs = await RepairJob.find({
      mechanicId: req.user._id,
      jobStatus: "Completed",
    })
      .populate("vehicleId")
      .sort({ completedAt: -1 });

    payments = await Payment.find({
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
        earnings: payment?.amount || job.totalCost,
        dateCompleted: job.completedAt,
      };
    });

    return res.json(history);
  }

  if (req.user.role === "admin") {
    jobs = await RepairJob.find({ jobStatus: "Completed" })
      .populate("vehicleId")
      .populate("customerId")
      .populate("mechanicId")
      .populate("requestId")
      .sort({ completedAt: -1 });

    payments = await Payment.find({ paymentStatus: "Completed" });

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

    return res.json(history);
  }

  res.status(403);
  throw new Error("Not authorized to view history");
};
