import Part from "../models/Part.js";

export const addPart = async (req, res) => {
  const { name, price, category, unit } = req.body;
  if (!name || !price) {
    res.status(400);
    throw new Error("Name and price are required");
  }
  const part = await Part.create({ name, price, category, unit });
  res.status(201).json(part);
};

export const getAllParts = async (req, res) => {
  const parts = await Part.find({ isActive: true });
  res.json(parts);
};

export const updatePart = async (req, res) => {
  const part = await Part.findById(req.params.id);
  if (!part) {
    res.status(404);
    throw new Error("Part not found");
  }

  const { name, price, category, unit, isActive } = req.body;
  if (name !== undefined) part.name = name;
  if (price !== undefined) part.price = price;
  if (category !== undefined) part.category = category;
  if (unit !== undefined) part.unit = unit;
  if (isActive !== undefined) part.isActive = isActive;

  const updatedPart = await part.save();
  res.json(updatedPart);
};

export const deletePart = async (req, res) => {
  const part = await Part.findById(req.params.id);
  if (!part) {
    res.status(404);
    throw new Error("Part not found");
  }
  part.isActive = false;
  await part.save();
  res.json({ message: "Part deactivated" });
};
