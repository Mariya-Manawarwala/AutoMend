import RepairRequest from "../models/RepairRequest.js";
import RepairJob from "../models/RepairJob.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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
  const vehicle = parseJson(req.body.vehicle);
  const description = req.body.description;
  let serviceIds = parseJson(req.body.serviceIds);
  const serviceType = req.body.serviceType;
  const location = parseJson(req.body.location);
  const scheduledDate = req.body.scheduledDate;
  const priority = req.body.priority || "normal";

  if (
    !vehicle ||
    !vehicle.brand ||
    !vehicle.model ||
    !description ||
    !serviceType ||
    !serviceIds ||
    !serviceIds.length ||
    !scheduledDate
  ) {
    res.status(400);
    throw new Error(
      "vehicle.brand, vehicle.model, description, serviceIds, serviceType, and scheduledDate are required",
    );
  }

  if (!["home", "garage", "current"].includes(serviceType)) {
    res.status(400);
    throw new Error("serviceType must be home, garage, or current");
  }

  if (typeof serviceIds === "string") {
    serviceIds = [serviceIds];
  }

  const customer = await User.findById(req.user._id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  let requestLocation;
  if (serviceType === "home") {
    if (customer.address) {
      requestLocation = {
        address: customer.address,
        lat: location?.lat,
        lng: location?.lng,
      };
    } else {
      if (
        !location?.address ||
        location.lat === undefined ||
        location.lng === undefined
      ) {
        res.status(400);
        throw new Error(
          "Home service requires location.address and location lat/lng when profile address is not available",
        );
      }
      requestLocation = location;
    }
  }

  if (serviceType === "garage") {
    const admin = await User.findOne({
      role: "admin",
      "garageLocation.address": { $exists: true },
    });
    if (!admin || !admin.garageLocation) {
      res.status(400);
      throw new Error("Garage location not configured by admin");
    }
    requestLocation = admin.garageLocation;
  }

  if (serviceType === "current") {
    if (
      !location?.address ||
      location.lat === undefined ||
      location.lng === undefined
    ) {
      res.status(400);
      throw new Error("Current location requires address, lat, and lng");
    }
    requestLocation = location;
  }

  const services = await Service.find({
    _id: { $in: serviceIds },
    isActive: true,
  });
  if (services.length !== serviceIds.length) {
    res.status(400);
    throw new Error("Some selected services are invalid or inactive");
  }

  let imageUrl;
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    imageUrl = uploadResult.secure_url;
  }

  const estimatedCost = services.reduce(
    (acc, service) => acc + service.basePrice,
    0,
  );

  const request = await RepairRequest.create({
    customerId: req.user._id,
    vehicle: {
      brand: vehicle.brand,
      model: vehicle.model,
      image: imageUrl,
    },
    description,
    serviceIds,
    serviceType,
    location: requestLocation,
    scheduledDate,
    priority,
    status: "Pending",
    estimatedCost,
  });

  const mechanics = await User.find({ role: "mechanic" });
  const notifs = mechanics.map((m) => ({
    userId: m._id,
    message: `New request: ${description}`,
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
    if (status === "Pending") {
      filter.assignedMechanicId = null;
    } else {
      filter.assignedMechanicId = req.user._id;
    }
  }

  if (req.user.role === "admin") {
    if (role === "admin") {
      // admin views all requests
    }
  }

  const requests = await RepairRequest.find(filter)
    .populate("customerId", "name phone")
    .populate("assignedMechanicId", "name phone")
    .populate("serviceIds")
    .sort({ createdAt: -1 });

  res.json(requests);
};

export const getRequestById = async (req, res) => {
  const request = await RepairRequest.findById(req.params.id)
    .populate("assignedMechanicId", "name phone")
    .populate("serviceIds");

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
    jobStatus: "InProgress",
  });

  await Notification.create({
    userId: request.customerId,
    message: `Mechanic ${req.user.name} has accepted your request.`,
    type: "request_accepted",
  });

  res.json({ request, job });
};
