import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const addVehicle = async (req, res) => {
  try {
    const { brand, model, numberPlate, plate, fuelType, fuel, yearBought } = req.body;
    
    const finalPlate = numberPlate || plate;
    const finalFuel = fuelType || fuel;

    if (!brand || !model || !finalPlate) {
      return res.status(400).json({ success: false, message: "Please provide brand, model and number plate" });
    }

    let imageUrl;
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ success: false, message: `Image upload failed: ${uploadError.message}` });
      }
    }

    const vehicle = await Vehicle.create({
      customerId: req.user._id,
      brand,
      model,
      numberPlate: finalPlate,
      fuelType: finalFuel || 'Petrol',
      yearBought: yearBought || new Date().getFullYear(),
      image: imageUrl
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { vehiclesOwned: vehicle._id },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    if (vehicle.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this vehicle" });
    }

    const { brand, model, numberPlate, plate, fuelType, fuel, yearBought } = req.body || {};
    
    if (brand) vehicle.brand = brand;
    if (model) vehicle.model = model;
    if (numberPlate || plate) vehicle.numberPlate = numberPlate || plate;
    if (fuelType || fuel) vehicle.fuelType = fuelType || fuel;
    if (yearBought) vehicle.yearBought = yearBought;

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        vehicle.image = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ success: false, message: `Image upload failed: ${uploadError.message}` });
      }
    } else if (req.body.removeImage === 'true') {
      vehicle.image = null;
    }

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
