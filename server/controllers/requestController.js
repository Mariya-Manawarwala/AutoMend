import mongoose from "mongoose";
import RepairRequest from "../models/RepairRequest.js";
import RepairJob from "../models/RepairJob.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { notifyAdmins } from "../utils/adminNotifier.js";
import Part from "../models/Part.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import Review from "../models/Review.js";


const parseJson = (value) => {
  if (!value) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

export const createRequest = async (req, res) => {
  // Support both frontend field names and backend names
  const { 
    vehicle: vehicleBody, 
    brand, model, plate,
    description: descBody, issue,
    serviceType: typeBody, type,
    location: locBody,
    scheduledDate: dateBody, date,
    priority: priorityBody
  } = req.body;

  let serviceIds = parseJson(req.body.serviceIds) || [];
  let partIds = parseJson(req.body.partIds) || [];

  const finalVehicle = vehicleBody ? parseJson(vehicleBody) : { brand, model, plate };
  const finalDescription = descBody || issue;
  const finalServiceType = (typeBody || type || 'Home').toLowerCase();
  const finalLocation = typeof locBody === 'string' ? parseJson(locBody) : locBody;
  const finalScheduledDate = dateBody || date;
  const priority = priorityBody || "normal";

  if (
    !finalVehicle ||
    !finalVehicle.brand ||
    !finalVehicle.model ||
    !finalDescription ||
    !finalServiceType ||
    !finalScheduledDate
  ) {
    res.status(400);
    throw new Error(
      "Vehicle brand, model, description, serviceType, and scheduledDate are required",
    );
  }

  if (!["home", "garage", "current"].includes(finalServiceType)) {
    res.status(400);
    throw new Error("serviceType must be home, garage, or current");
  }

  if (typeof serviceIds === "string") {
    serviceIds = [serviceIds];
  }
  if (typeof partIds === "string") {
    partIds = [partIds];
  }

  const customer = await User.findById(req.user._id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  let requestLocation;
  if (finalServiceType === "home") {
    if (customer.address) {
      requestLocation = {
        address: customer.address,
        lat: finalLocation?.lat,
        lng: finalLocation?.lng,
      };
    } else {
      const addr = typeof finalLocation === 'string' ? finalLocation : finalLocation?.address;
      if (!addr) {
        res.status(400);
        throw new Error("Home service requires a service address");
      }
      requestLocation = typeof finalLocation === 'object' ? finalLocation : { address: addr };
    }
  }

  if (finalServiceType === "garage") {
    const admin = await User.findOne({
      role: "admin",
      "garageLocation.address": { $exists: true },
    });
    if (!admin || !admin.garageLocation) {
      // Default fallback if admin hasn't set it
      requestLocation = { address: "AutoMend Premium Garage, 123 Auto Street" };
    } else {
      requestLocation = admin.garageLocation;
    }
  }

  const validServiceIds = Array.isArray(serviceIds) ? serviceIds.filter(id => mongoose.Types.ObjectId.isValid(id)) : [];
  const validPartIds = Array.isArray(partIds) ? partIds.filter(id => mongoose.Types.ObjectId.isValid(id)) : [];
  
  let services = [];
  if (validServiceIds.length > 0) {
    services = await Service.find({ _id: { $in: validServiceIds }, isActive: true });
  }

  let parts = [];
  if (validPartIds.length > 0) {
    parts = await Part.find({ _id: { $in: validPartIds }, isActive: true });
  }

  let imageUrl;
  if (req.file) {
    try {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      // Continue without image if upload fails
    }
  }

  const estimatedCost = (services.reduce((acc, s) => acc + s.basePrice, 0)) + 
                        (parts.reduce((acc, p) => acc + p.unitPrice, 0));

  const request = await RepairRequest.create({
    customerId: req.user._id,
    vehicle: {
      brand: finalVehicle.brand,
      model: finalVehicle.model,
      image: imageUrl,
    },
    description: finalDescription,
    serviceIds: validServiceIds,
    partIds: validPartIds,
    serviceType: finalServiceType,
    location: requestLocation,
    scheduledDate: finalScheduledDate,
    priority,
    status: "Pending", // Initial status is always pending until admin approves
    estimatedCost,
  });

  await notifyAdmins(`New service request for ${request.vehicle.brand} ${request.vehicle.model}`, "new_request", { requestId: request._id });

  // Create notifications
  const mechanics = await User.find({ role: "mechanic" });
  const notifs = mechanics.map((m) => ({
    userId: m._id,
    message: `New request: ${finalDescription}`,
    type: "new_request",
  }));
  if (notifs.length > 0) await Notification.insertMany(notifs);

  res.status(201).json(request);
};

export const getRequests = async (req, res) => {
  const filter = {};
  const { status, role } = req.query;

  if (req.user.role === "customer") {
    filter.customerId = req.user._id;
  }

  if (status) {
    filter.status = status;
  }

  if (req.user.role === "mechanic") {
    const isAvailablePool = req.originalUrl.includes('/available');
    if (isAvailablePool || status === "Pending") {
      filter.assignedMechanicId = null;
      filter.status = "Pending";
    } else {
      filter.assignedMechanicId = req.user._id;
    }
  }

  const requests = await RepairRequest.find(filter)
    .populate("customerId", "name phone profilePic")
    .populate("assignedMechanicId", "name phone profilePic skills experience age address")
    .populate("serviceIds")
    .populate("partIds")
    .sort({ createdAt: -1 });

  const requestsWithJobs = await Promise.all(
    requests.map(async (req) => {
      const job = await RepairJob.findOne({ requestId: req._id });
      let isReviewed = false;
      if (job) {
        const review = await Review.findOne({ jobId: job._id });
        if (review) isReviewed = true;
      }
      return { ...req._doc, jobId: job, isReviewed };
    }),
  );

  res.json(requestsWithJobs);
};

export const getRequestById = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id)
    .populate("assignedMechanicId", "name phone profilePic skills experience age address")
    .populate("serviceIds")
    .populate("partIds");

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

  const job = await RepairJob.findOne({ requestId: request._id });
  let isReviewed = false;
  if (job) {
    const review = await Review.findOne({ jobId: job._id });
    if (review) isReviewed = true;
  }

  res.json({ ...request._doc, jobId: job, isReviewed });
};

export const acceptRequest = async (req, res) => {
  const { mechanicLocation, eta } = req.body; // eta is in minutes or a date string

  const request = await RepairRequest.findOneAndUpdate(
    { _id: req.params.id, assignedMechanicId: null, status: { $in: ["Pending", "Approved"] } },
    {
      $set: {
        assignedMechanicId: req.user._id,
        status: "Accepted",
        acceptedAt: new Date(),
        mechanicLocation: mechanicLocation,
        eta: eta
      },
    },
    { new: true },
  );

  if (!request) {
    res.status(400);
    throw new Error("Request already accepted or not available");
  }

  // Calculate arrival time if eta is provided as minutes
  let estimatedArrivalTime;
  if (eta) {
    estimatedArrivalTime = new Date();
    estimatedArrivalTime.setMinutes(estimatedArrivalTime.getMinutes() + parseInt(eta));
  }

  // Copy services and parts from request to the job
  const services = await Service.find({ _id: { $in: request.serviceIds } });
  const parts = await Part.find({ _id: { $in: request.partIds } });

  const job = await RepairJob.create({
    requestId: request._id,
    mechanicId: req.user._id,
    customerId: request.customerId,
    jobStatus: "InProgress",
    mechanicLocation,
    estimatedArrivalTime,
    servicesUsed: services.map(s => ({ 
      serviceId: s._id, 
      name: s.name, 
      price: s.basePrice 
    })),
    partsUsed: parts.map(p => ({ 
      partId: p._id, 
      name: p.name, 
      price: p.unitPrice, 
      quantity: 1,
      partNumber: p.partNumber || 'N/A'
    })),
  });

  await Notification.create({
    userId: request.customerId,
    message: `Mechanic ${req.user.name} has accepted your request. ETA: ${eta ? eta + ' mins' : 'Calculating...'}`,
    type: "request_accepted",
  });

  res.json({ request, job });
};

export const approveRequest = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  request.status = "Approved";
  await request.save();

  await Notification.create({
    userId: request.customerId,
    message: `Your service request for ${request.vehicle.brand} ${request.vehicle.model} has been APPROVED.`,
    type: "request_approved",
  });

  // Notify all mechanics about approved available request
  const mechanics = await User.find({ role: "mechanic" });
  const notifs = mechanics.map((m) => ({
    userId: m._id,
    message: `New approved request available for ${request.vehicle.brand}`,
    type: "new_request",
  }));
  if (notifs.length > 0) await Notification.insertMany(notifs);

  res.json({ message: "Request approved", request });
};

export const rejectRequest = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  request.status = "Rejected";
  await request.save();

  await Notification.create({
    userId: request.customerId,
    message: `Your service request for ${request.vehicle.brand} ${request.vehicle.model} was REJECTED by the admin.`,
    type: "request_rejected",
  });

  res.json({ message: "Request rejected", request });
};

export const deleteRequest = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (request.customerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  if (request.status !== "Pending" && request.status !== "Approved") {
    res.status(400);
    throw new Error("Cannot delete a request that has already been accepted");
  }

  await RepairRequest.findByIdAndDelete(req.params.id);
  res.json({ message: "Request deleted successfully" });
};

export const updateRequest = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (request.customerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  if (request.status !== "Pending" && request.status !== "Approved") {
    res.status(400);
    throw new Error("Cannot edit a request that has already been accepted");
  }

  const { description, serviceIds, partIds, serviceType, scheduledDate, location } = req.body;

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    request.vehicle.image = uploadResult.secure_url;
  }

  if (description) request.description = description;
  if (serviceIds) request.serviceIds = JSON.parse(serviceIds);
  if (partIds) request.partIds = JSON.parse(partIds);
  if (serviceType) request.serviceType = serviceType;
  if (scheduledDate) request.scheduledDate = scheduledDate;
  if (location) request.location = typeof location === 'string' ? JSON.parse(location) : location;

  const services = await Service.find({ _id: { $in: request.serviceIds } });
  const parts = await Part.find({ _id: { $in: request.partIds } });
  request.estimatedCost = services.reduce((acc, s) => acc + s.basePrice, 0) + 
                         parts.reduce((acc, p) => acc + (p.unitPrice || 0), 0);

  const updatedRequest = await request.save();
  res.json(updatedRequest);
};


