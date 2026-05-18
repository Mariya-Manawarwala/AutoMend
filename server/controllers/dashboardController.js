import mongoose from "mongoose";
import User from "../models/User.js";
import RepairRequest from "../models/RepairRequest.js";
import RepairJob from "../models/RepairJob.js";
import Payment from "../models/Payment.js";
import SystemSettings from "../models/SystemSettings.js";
import Notification from "../models/Notification.js";

export const getDashboard = async (req, res) => {
  // Self-healing: Heal any missing payments globally before calculating revenue statistics
  try {
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
  } catch (healErr) {
    console.error("Heal payments in getDashboard error:", healErr);
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Users Stats
  const totalCustomers = await User.countDocuments({ role: "customer" });
  const newCustomersThisWeek = await User.countDocuments({ 
    role: "customer", 
    createdAt: { $gte: sevenDaysAgo } 
  });

  // Mechanics Stats
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
  const activeMechanicsCount = await User.countDocuments({
    role: "mechanic",
    isOnline: true,
    lastSeen: { $gte: fiveMinsAgo }
  });
  const pendingMechanicsCount = await User.countDocuments({
    role: "mechanic",
    status: "pending"
  });

  // Jobs Stats
  const jobsInProgressCount = await RepairRequest.countDocuments({
    status: { $in: ["Approved", "InProgress"] }
  });
  const unassignedRequestsCount = await RepairRequest.countDocuments({
    status: "Pending"
  });

  // Revenue Stats
  const payments = await Payment.find({ paymentStatus: "completed" });
  const totalRevenue = payments.reduce((acc, pay) => acc + pay.amount, 0);
  
  const monthlyPayments = await Payment.find({ 
    paymentStatus: "completed",
    createdAt: { $gte: startOfMonth }
  });
  const revenueThisMonth = monthlyPayments.reduce((acc, pay) => acc + pay.amount, 0);

  res.json({
    stats: {
      totalCustomers: { value: totalCustomers, trend: newCustomersThisWeek },
      activeMechanics: { value: activeMechanicsCount, pending: pendingMechanicsCount },
      jobsInProgress: { value: jobsInProgressCount },
      totalRevenue: { value: totalRevenue, thisMonth: revenueThisMonth }
    },
    actionCenter: {
      unassignedRequests: unassignedRequestsCount,
      pendingMechanics: pendingMechanicsCount
    }
  });
};

export const getRevenueStats = async (req, res) => {
  // Self-healing: Heal any missing payments globally before calculating revenue trends
  try {
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
  } catch (healErr) {
    console.error("Heal payments in getRevenueStats error:", healErr);
  }

  const { timeframe = "6months" } = req.query;
  let startDate = new Date();
  let grouping = {};

  if (timeframe === "6months") {
    startDate.setMonth(startDate.getMonth() - 6);
    grouping = { $month: "$createdAt" };
  } else if (timeframe === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
    grouping = { $month: "$createdAt" };
  } else if (timeframe === "month") {
    startDate.setMonth(startDate.getMonth() - 1);
    grouping = { $dayOfMonth: "$createdAt" };
  } else if (timeframe === "week") {
    startDate.setDate(startDate.getDate() - 7);
    grouping = { $dayOfWeek: "$createdAt" };
  }

  const revenueData = await Payment.aggregate([
    { $match: { paymentStatus: "completed", createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: grouping,
        total: { $sum: "$amount" },
        date: { $first: "$createdAt" }
      }
    },
    { $sort: { date: 1 } }
  ]);

  res.json(revenueData);
};

export const getSystemHealth = async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "operational" : "down";
  
  res.json({
    status: "operational",
    systems: {
      database: dbStatus,
      server: "operational",
      payments: "operational",
      storage: "operational"
    }
  });
};

export const updateGarageDetails = async (req, res) => {
  const { garageLocation } = req.body;
  const admin = await User.findById(req.user._id);

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  if (garageLocation) {
    admin.garageLocation = garageLocation;
  }

  const updatedAdmin = await admin.save();
  res.json(updatedAdmin);
};

export const getMechanics = async (req, res) => {
  const mechanics = await User.find({
    role: "mechanic",
    adminId: req.user._id,
  }).select("-password");
  res.json(mechanics);
};

export const getPendingMechanics = async (req, res) => {
  try {
    const pendingMechanics = await User.find({
      role: "mechanic",
      status: "pending",
    }).select("_id name email phone skills status createdAt address age fullName profilePhoto");
    res.json(pendingMechanics);
  } catch (error) {
    console.error("GET PENDING MECHANICS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveMechanic = async (req, res) => {
  const mechanic = await User.findById(req.params.id);

  if (!mechanic || mechanic.role !== "mechanic") {
    res.status(404);
    throw new Error("Mechanic not found");
  }

  mechanic.status = "approved";
  mechanic.isVerified = true;
  mechanic.rejectionReason = ""; // Clear reason if previously rejected
  await mechanic.save();

  await Notification.create({
    userId: mechanic._id,
    message: "Your account has been approved. Welcome to AutoMend!",
    type: "mechanic_approved",
  });

  res.json({
    message: "Mechanic approved",
    mechanic: mechanic.toObject({ getters: true }),
  });
};

export const rejectMechanic = async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    res.status(400);
    throw new Error("Reason for rejection is required");
  }

  const mechanic = await User.findById(req.params.id);

  if (!mechanic || mechanic.role !== "mechanic") {
    res.status(404);
    throw new Error("Mechanic not found");
  }

  mechanic.status = "rejected";
  mechanic.rejectionReason = reason;
  await mechanic.save();

  await Notification.create({
    userId: mechanic._id,
    message: `Your account was rejected. Reason: ${reason}`,
    type: "mechanic_rejected",
  });

  res.json({
    message: "Mechanic rejected",
    mechanic: mechanic.toObject({ getters: true }),
  });
};

export const getUsers = async (req, res) => {
  const { role = "customer", search = "", accountStatus = "" } = req.query;
  const query = { role };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (accountStatus) {
    query.accountStatus = accountStatus;
  }

  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const updateUserAccountStatus = async (req, res) => {
  const { accountStatus, durationWeeks } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.accountStatus = accountStatus;
  if (accountStatus === "deactivated" && durationWeeks) {
    const until = new Date();
    until.setDate(until.getDate() + (durationWeeks * 7));
    user.deactivatedUntil = until;
  } else if (accountStatus === "active") {
    user.deactivatedUntil = undefined;
  }

  await user.save();
  res.json({ message: `User status updated to ${accountStatus}`, user });
};

// @desc    Get all active jobs (InProgress, Completed)
// @route   GET /api/admin/dashboard/active-jobs
// @access  Private/Admin
export const getActiveJobs = async (req, res) => {
  try {
    const jobs = await RepairJob.find({})
      .populate('customerId', 'name email phone avatar')
      .populate('mechanicId', 'name email phone avatar mechanicDetails')
      .populate({
        path: 'requestId',
        populate: [
          { path: 'serviceIds', select: 'title basePrice icon' },
          { path: 'partIds', select: 'name unitPrice' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error("Get Active Jobs Error:", error);
    res.status(500).json({ message: "Failed to fetch active jobs" });
  }
};

// @desc    Get Global System Settings
// @route   GET /api/admin/dashboard/settings
// @access  Private/Admin
export const getSystemSettings = async (req, res) => {
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create({});
  }
  res.json(settings);
};

// @desc    Update Global System Settings
// @route   PUT /api/admin/dashboard/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res) => {
  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = new SystemSettings(req.body);
  } else {
    Object.assign(settings, req.body);
  }
  const updated = await settings.save();
  res.json(updated);
};
