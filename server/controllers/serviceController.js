import Service from "../models/Service.js";

export const addService = async (req, res) => {
  const { name, basePrice, category, description } = req.body;
  if (!name || !basePrice) {
    res.status(400);
    throw new Error("Name and basePrice are required");
  }
  const service = await Service.create({
    name,
    basePrice,
    category,
    description,
  });
  res.status(201).json(service);
};

export const getAllServices = async (req, res) => {
  const services = await Service.find({ isActive: true });
  res.json(services);
};

export const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  const { name, basePrice, category, description, isActive } = req.body;
  if (name !== undefined) service.name = name;
  if (basePrice !== undefined) service.basePrice = basePrice;
  if (category !== undefined) service.category = category;
  if (description !== undefined) service.description = description;
  if (isActive !== undefined) service.isActive = isActive;

  const updatedService = await service.save();
  res.json(updatedService);
};

export const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  service.isActive = false;
  await service.save();
  res.json({ message: "Service deactivated" });
};
