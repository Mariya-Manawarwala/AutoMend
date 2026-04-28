import User from "../models/User.js";
import RepairRequest from "../models/RepairRequest.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";

export const getDashboard = async (req, res) => {
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

  const admin = await User.findById(req.user._id).select("-password");

  res.json({
    totalMechanics,
    totalCustomers,
    totalRequests,
    pendingRequests,
    completedRequests,
    totalRevenue,
    garageLocation: admin.garageLocation,
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
  const pendingMechanics = await User.find({
    role: "mechanic",
    adminId: req.user._id,
    status: "pending",
  }).select("_id name email phone skills status createdAt -password");
  res.json(pendingMechanics);
};

export const approveMechanic = async (req, res) => {
  const mechanic = await User.findById(req.params.id);

  if (!mechanic || mechanic.role !== "mechanic") {
    res.status(404);
    throw new Error("Mechanic not found");
  }

  if (mechanic.adminId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only approve your own mechanics");
  }

  mechanic.status = "approved";
  mechanic.isVerified = true;
  await mechanic.save();

  await Notification.create({
    userId: mechanic._id,
    message: "Your account has been approved",
    type: "mechanic_approved",
  });

  res.json({
    message: "Mechanic approved",
    mechanic: mechanic.toObject({ getters: true }),
  });
};

export const rejectMechanic = async (req, res) => {
  const mechanic = await User.findById(req.params.id);

  if (!mechanic || mechanic.role !== "mechanic") {
    res.status(404);
    throw new Error("Mechanic not found");
  }

  if (mechanic.adminId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only reject your own mechanics");
  }

  mechanic.status = "rejected";
  await mechanic.save();

  await Notification.create({
    userId: mechanic._id,
    message: "Your account was rejected",
    type: "mechanic_rejected",
  });

  res.json({
    message: "Mechanic rejected",
    mechanic: mechanic.toObject({ getters: true }),
  });
};
