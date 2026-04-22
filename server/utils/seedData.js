import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Service from "../models/Service.js";
import Part from "../models/Part.js";
import connectDB from "../config/dbConfg.js";

dotenv.config();

const services = [
  {
    name: "Engine Repair",
    price: 3500,
    category: "Engine",
    description: "Engine repair",
  },
  {
    name: "Oil Change",
    price: 800,
    category: "Engine",
    description: "Oil change",
  },
  {
    name: "Brake Service",
    price: 1200,
    category: "Brakes",
    description: "Brake fix",
  },
];

const parts = [
  { name: "Engine Oil", price: 500, category: "Engine", unit: "litre" },
  { name: "Brake Pads", price: 1500, category: "Brakes", unit: "set" },
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
