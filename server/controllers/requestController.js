import RepairRequest from "../models/RepairRequest.js";
import RepairJob from "../models/RepairJob.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const createRequest = async (req, res) => {
  const { vehicleId, problemDescription, serviceType } = req.body;

  if (!vehicleId || !problemDescription || !serviceType) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || vehicle.customerId.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("Invalid vehicle");
  }

  let customerAddress = "";
  if (serviceType === "HomeService") {
    const customer = await User.findById(req.user._id);
    customerAddress = customer.address || "";
    if (!customerAddress) {
      res.status(400);
      throw new Error("Please add an address to your profile for Home Service");
    }
  }

  const request = await RepairRequest.create({
    customerId: req.user._id,
    vehicleId,
    problemDescription,
    serviceType,
    customerAddress,
    status: "Pending",
  });

  if (serviceType === "HomeService") {
    const mechanics = await User.find({ role: "mechanic" });
    const notifs = mechanics.map((m) => ({
      userId: m._id,
      message: `New Home Service request: ${problemDescription}`,
      type: "new_request",
    }));
    if (notifs.length > 0) await Notification.insertMany(notifs);
  }

  res.status(201).json(request);
};

export const getMyRequests = async (req, res) => {
  const requests = await RepairRequest.find({ customerId: req.user._id })
    .populate("vehicleId")
    .populate("assignedMechanicId", "name phone")
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const getRequestById = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id)
    .populate("vehicleId")
    .populate("assignedMechanicId", "name phone");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (
    req.user.role === "customer" &&
    request.customerId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.json(request);
};

export const getAvailableRequests = async (req, res) => {
  const requests = await RepairRequest.find({
    serviceType: "HomeService",
    status: "Pending",
    assignedMechanicId: null,
  })
    .populate("vehicleId")
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const getGarageQueue = async (req, res) => {
  const requests = await RepairRequest.find({
    serviceType: "GarageVisit",
    status: "Pending",
    assignedMechanicId: null,
  })
    .populate("vehicleId")
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const acceptRequest = async (req, res) => {
  const request = await RepairRequest.findOneAndUpdate(
    { _id: req.params.id, assignedMechanicId: null, status: "Pending" },
    {
      $set: {
        assignedMechanicId: req.user._id,
        status: "InProgress",
        acceptedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!request) {
    res.status(400);
    throw new Error("Request already accepted or not available");
  }

  const job = await RepairJob.create({
    requestId: request._id,
    mechanicId: req.user._id,
    customerId: request.customerId,
    vehicleId: request.vehicleId,
  });

  await Notification.create({
    userId: request.customerId,
    message: `Mechanic ${req.user.name} has accepted your request.`,
    type: "request_accepted",
  });

  res.json({ request, job });
};

export const getMyJobs = async (req, res) => {
  const requests = await RepairRequest.find({
    assignedMechanicId: req.user._id,
  })
    .populate("vehicleId")
    .populate("customerId", "name phone address fullName")
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const getAllRequests = async (req, res) => {
  const requests = await RepairRequest.find({})
    .populate("vehicleId")
    .populate("customerId", "name phone")
    .populate("assignedMechanicId", "name phone")
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const getRequestByIdAdmin = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id)
    .populate("vehicleId")
    .populate("customerId")
    .populate("assignedMechanicId");
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }
  res.json(request);
};

export const updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  const request = await RepairRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  request.status = status;
  const updatedRequest = await request.save();

  await Notification.create({
    userId: request.customerId,
    message: `Your request status is now: ${status}`,
    type: "status_update",
  });

  res.json(updatedRequest);
};
