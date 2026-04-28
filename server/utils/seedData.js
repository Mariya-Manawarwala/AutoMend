import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Service from "../models/Service.js";
import Part from "../models/Part.js";
import connectDB from "../config/dbConfg.js";

dotenv.config();

const services = [
  {
    name: "Full Engine Diagnostic",
    basePrice: 1500,
    category: "Engine",
    duration: "1.5 hrs",
    description: "Comprehensive scan and manual inspection of all engine components.",
  },
  {
    name: "Premium Oil Change",
    basePrice: 850,
    category: "Maintenance",
    duration: "45 mins",
    description: "Synthetic oil replacement and high-performance filter installation.",
  },
  {
    name: "Brake System Overhaul",
    basePrice: 2200,
    category: "Brakes",
    duration: "2 hrs",
    description: "Replacement of pads, rotors, and fluid flush for maximum safety.",
  },
  {
    name: "AC Gas Recharge",
    basePrice: 1200,
    category: "Cooling",
    duration: "1 hr",
    description: "Full AC system check and R134a refrigerant refill.",
  },
];

const parts = [
  { name: "Synthetic Motor Oil (5L)", unitPrice: 3200, category: "Fluids", unit: "can", stock: 25, minStock: 5, supplier: "Shell" },
  { name: "Ceramic Brake Pads", unitPrice: 1800, category: "Brakes", unit: "set", stock: 12, minStock: 4, supplier: "Bosch" },
  { name: "Oil Filter (Universal)", unitPrice: 450, category: "Filters", unit: "piece", stock: 50, minStock: 10, supplier: "Mann" },
  { name: "Air Filter", unitPrice: 650, category: "Filters", unit: "piece", stock: 30, minStock: 8, supplier: "K&N" },
];

const seedData = async () => {
  try {
    await connectDB();
    await Service.deleteMany();
    await Part.deleteMany();

    await Service.insertMany(services);
    await Part.insertMany(parts);

    console.log("Data Seeded Successfully".green);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

seedData();
