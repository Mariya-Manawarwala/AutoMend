import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

export const addVehicle = async (req, res) => {
  const { brand, model, numberPlate, fuelType, yearBought } = req.body;

  if (!brand || !model || !numberPlate || !fuelType || !yearBought) {
    res.status(400);
    throw new Error("Please provide all vehicle details");
  }

  const vehicle = await Vehicle.create({
    customerId: req.user._id,
    brand,
    model,
    numberPlate,
    fuelType,
    yearBought,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { vehiclesOwned: vehicle._id },
  });

  res.status(201).json(vehicle);
};

export const getMyVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ customerId: req.user._id });
  res.json(vehicles);
};

export const getVehicleById = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }
  res.json(vehicle);
};

export const updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  if (vehicle.customerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this vehicle");
  }

  const { brand, model, numberPlate, fuelType, yearBought } = req.body;
  if (brand) vehicle.brand = brand;
  if (model) vehicle.model = model;
  if (numberPlate) vehicle.numberPlate = numberPlate;
  if (fuelType) vehicle.fuelType = fuelType;
  if (yearBought) vehicle.yearBought = yearBought;

  const updatedVehicle = await vehicle.save();
  res.json(updatedVehicle);
};

export const deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  if (vehicle.customerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this vehicle");
  }

  await Vehicle.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { vehiclesOwned: vehicle._id },
  });

  res.json({ message: "Vehicle removed" });
};
