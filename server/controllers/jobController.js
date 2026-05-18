import RepairJob from "../models/RepairJob.js";
import RepairRequest from "../models/RepairRequest.js";
import Service from "../models/Service.js";
import Part from "../models/Part.js";
import Notification from "../models/Notification.js";
import Payment from "../models/Payment.js";
import { notifyAdmins } from "../utils/adminNotifier.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";
import { sendInvoiceEmail } from "../utils/emailService.js";

export const getJobByRequestId = async (req, res) => {
  const job = await RepairJob.findOne({ requestId: req.params.requestId })
    .populate({
      path: "requestId",
      populate: { path: "serviceIds" }
    })
    .populate("vehicleId")
    .populate("customerId", "name phone address fullName");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  res.json(job);
};

export const getJobById = async (req, res) => {
  const job = await RepairJob.findById(req.params.id)
    .populate({
      path: "requestId",
      populate: { path: "serviceIds" }
    })
    .populate("customerId", "name phone address fullName")
    .populate("mechanicId", "name phone");

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


export const submitBill = async (req, res) => {
  const { servicesUsed, partsUsed } = req.body;
  
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

  // Update with finalized data from mechanic
  if (servicesUsed) {
    job.servicesUsed = servicesUsed;
  }
  if (partsUsed) {
    job.partsUsed = partsUsed;
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
  job.totalCost = job.subtotal;
  
  // Calculate Earnings
  const MECHANIC_COMMISSION_RATE = 0.60; 
  job.mechanicEarning = servicesTotal * MECHANIC_COMMISSION_RATE;
  job.platformCommission = servicesTotal * (1 - MECHANIC_COMMISSION_RATE);
  
  job.jobStatus = "PaymentPending";
  job.billSubmitted = true;
  job.completedAt = new Date();
  await job.save();

  // Notify Customer
  await Notification.create({
    userId: job.customerId._id,
    message: `Your service bill for ${job.vehicleId?.brand || 'your vehicle'} is ready for payment.`,
    type: "bill_ready",
    metadata: { jobId: job._id }
  });

  await notifyAdmins(`Job bill submitted for ${job.vehicleId?.brand || 'Vehicle'}. Amount: ₹${job.totalCost}`, "bill_submitted", { jobId: job._id });

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

  res.json({ success: true, message: "Bill submitted successfully. Awaiting customer payment.", job, payment });
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

export const getMyJobs = async (req, res) => {
  const { status } = req.query;
  const mechanicId = req.user._id;

  let query = { mechanicId };
  if (status === 'active') {
    query.jobStatus = { $nin: ['Completed', 'Cancelled'] };
  } else if (status === 'completed') {
    query.jobStatus = 'Completed';
  }

  try {
    const jobs = await RepairJob.find(query)
      .populate('requestId')
      .populate('vehicleId')
      .populate('customerId', 'name phone address')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const job = await RepairJob.findById(id).populate('requestId').populate('customerId').populate('mechanicId');
    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    // Auth check: Mechanic who owns the job OR Admin
    if (job.mechanicId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error("Not authorized to update this job status");
    }

    job.jobStatus = status;
    if (status === 'Completed' && !job.completedAt) {
      job.completedAt = new Date();
    }
    await job.save();

    // Update the parent request status for global consistency
    if (job.requestId) {
      await RepairRequest.findByIdAndUpdate(job.requestId._id, { status });
    }

    // Notify Customer
    await Notification.create({
      userId: job.customerId._id,
      message: `Progress Update: Your vehicle repair is now ${status}.`,
      type: "job_status_update",
    });

    // Notify Admin
    await notifyAdmins(`Job ${job._id.slice(-6)} status: ${status} (updated by ${job.mechanicId.name})`, "job_update", { jobId: job._id });

    res.json({ success: true, message: "Status updated successfully", job });
  } catch (error) {
    console.error("Update Job Status Error:", error);
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

export const updateMechanicLocation = async (req, res) => {
  const { lat, lng } = req.body;
  const job = await RepairJob.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.mechanicId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update location for this job");
  }
  job.mechanicLocation = { lat, lng };
  await job.save();

  res.json({ success: true, mechanicLocation: job.mechanicLocation });
};

export const getMechanicEarnings = async (req, res) => {
  const mechanicId = req.user._id;
  
  const jobs = await RepairJob.find({ 
    mechanicId, 
    jobStatus: "Completed" 
  }).sort({ completedAt: -1 }).populate('requestId');

  const today = new Date();
  today.setHours(0,0,0,0);
  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayEarnings = jobs
    .filter(j => j.completedAt >= today)
    .reduce((acc, j) => acc + (j.mechanicEarning || 0) + (j.bonus || 0) + (j.tips || 0), 0);

  const weekEarnings = jobs
    .filter(j => j.completedAt >= weekStart)
    .reduce((acc, j) => acc + (j.mechanicEarning || 0) + (j.bonus || 0) + (j.tips || 0), 0);

  const monthEarnings = jobs
    .filter(j => j.completedAt >= monthStart)
    .reduce((acc, j) => acc + (j.mechanicEarning || 0) + (j.bonus || 0) + (j.tips || 0), 0);

  res.json({
    stats: {
      today: todayEarnings,
      week: weekEarnings,
      month: monthEarnings,
      completed: jobs.length
    },
    history: jobs.map(j => ({
      id: j._id,
      requestId: j.requestId?._id,
      vehicle: `${j.requestId?.vehicle?.brand || 'Vehicle'} ${j.requestId?.vehicle?.model || ''}`,
      description: j.requestId?.description,
      laborCharges: j.servicesUsed.reduce((acc, s) => acc + (s.price || 0), 0),
      earning: j.mechanicEarning || 0,
      bonus: j.bonus || 0,
      tips: j.tips || 0,
      total: (j.mechanicEarning || 0) + (j.bonus || 0) + (j.tips || 0),
      date: j.completedAt,
      payoutStatus: j.payoutStatus || 'Pending'
    }))
  });
};

export const generateFinalInvoice = async (req, res) => {
  const job = await RepairJob.findById(req.params.id)
    .populate("customerId")
    .populate("mechanicId")
    .populate("vehicleId");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.paymentStatus !== "paid") {
    res.status(400);
    throw new Error("Invoice can only be generated after payment is completed");
  }

  // Find the successful payment for this job
  const payment = await Payment.findOne({ jobId: job._id, paymentStatus: "completed" });
  if (!payment) {
    res.status(404);
    throw new Error("Payment record not found");
  }

  try {
    const filePath = await generateInvoicePDF(job, payment);
    job.invoiceUrl = `/invoices/invoice_${payment._id}.pdf`;
    await job.save();

    // Send Email
    try {
      await sendInvoiceEmail(job.customerId.email, job, payment, filePath);
    } catch (emailErr) {
      console.error("Email failed but invoice generated:", emailErr);
    }

    res.json({ success: true, message: "Invoice generated and sent to customer", invoiceUrl: job.invoiceUrl });
  } catch (err) {
    console.error("Invoice Generation Error:", err);
    res.status(500).json({ success: false, message: "Failed to generate invoice" });
  }
};
