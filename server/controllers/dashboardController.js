import User from "../models/User.js";
import RepairRequest from "../models/RepairRequest.js";
import Payment from "../models/Payment.js";

export const getDashboardStats = async (req, res) => {
  const totalMechanics = await User.countDocuments({
    role: "mechanic",
    adminId: req.user._id,
  });
  const totalCustomers = await User.countDocuments({ role: "customer" });
  const totalRequests = await RepairRequest.countDocuments();
  const pendingRequests = await RepairRequest.countDocuments({
    status: "Pending",
  });
  const completedRequests = await RepairRequest.countDocuments({
    status: "Completed",
  });

  const payments = await Payment.find({ paymentStatus: "Completed" });
  const totalRevenue = payments.reduce((acc, pay) => acc + pay.amount, 0);

  res.json({
    totalMechanics,
    totalCustomers,
    totalRequests,
    pendingRequests,
    completedRequests,
    totalRevenue,
  });
};

export const getGarageDetails = async (req, res) => {
  const admin = await User.findById(req.user._id).select("-password");
  res.json(admin);
};

export const updateGarageDetails = async (req, res) => {
  const { garageAddress, openingTime, closingTime, contactInfo, serviceRange } =
    req.body;
  const admin = await User.findById(req.user._id);

  if (garageAddress) admin.garageAddress = garageAddress;
  if (openingTime) admin.openingTime = openingTime;
  if (closingTime) admin.closingTime = closingTime;
  if (contactInfo) admin.contactInfo = contactInfo;
  if (serviceRange) admin.serviceRange = serviceRange;

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
