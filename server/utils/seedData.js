import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Service from "../models/Service.js";
import Part from "../models/Part.js";
import connectDB from "../config/dbConfg.js";

dotenv.config();

const services = [
  { name: 'Engine Repair', basePrice: 3500, category: 'Engine', description: 'Full engine repair and diagnostics' },
  { name: 'Engine Tune-Up', basePrice: 1200, category: 'Engine', description: 'Engine tune-up for optimal performance' },
  { name: 'Oil Change', basePrice: 400, category: 'Engine', description: 'Engine oil drain and refill' },
  { name: 'Brake Inspection', basePrice: 300, category: 'Brakes', description: 'Full brake system inspection' },
  { name: 'Brake Service', basePrice: 800, category: 'Brakes', description: 'Brake system servicing' },
  { name: 'Brake Pad Replacement', basePrice: 1200, category: 'Brakes', description: 'Front and rear brake pad replacement' },
  { name: 'Clutch Repair', basePrice: 1500, category: 'Transmission', description: 'Clutch adjustment and repair' },
  { name: 'Clutch Replacement', basePrice: 3000, category: 'Transmission', description: 'Full clutch assembly replacement' },
  { name: 'Tyre Replacement', basePrice: 500, category: 'Tyres', description: 'Tyre removal and fitting (per tyre)' },
  { name: 'Tyre Rotation & Balancing', basePrice: 600, category: 'Tyres', description: 'All four tyre rotation and wheel balancing' },
  { name: 'Puncture Repair', basePrice: 150, category: 'Tyres', description: 'Tubeless or tube tyre puncture repair' },
  { name: 'Battery Check', basePrice: 200, category: 'Electrical', description: 'Battery health and charge test' },
  { name: 'Battery Replacement', basePrice: 400, category: 'Electrical', description: 'Old battery removal and new battery fitting' },
  { name: 'AC Repair', basePrice: 2000, category: 'AC', description: 'Air conditioning system repair' },
  { name: 'AC Gas Refill', basePrice: 1200, category: 'AC', description: 'AC refrigerant gas refilling' },
  { name: 'AC Filter Cleaning', basePrice: 400, category: 'AC', description: 'Cabin and AC filter cleaning' },
  { name: 'Electrical Diagnostics', basePrice: 500, category: 'Electrical', description: 'Full vehicle electrical system diagnostics' },
  { name: 'Wiring Repair', basePrice: 800, category: 'Electrical', description: 'Faulty wiring identification and repair' },
  { name: 'Suspension Check', basePrice: 400, category: 'Suspension', description: 'Full suspension system inspection' },
  { name: 'Suspension Repair', basePrice: 2500, category: 'Suspension', description: 'Suspension component repair or replacement' },
  { name: 'Wheel Alignment', basePrice: 700, category: 'Wheels', description: 'Four-wheel computerized alignment' },
  { name: 'Wheel Balancing', basePrice: 400, category: 'Wheels', description: 'All wheel dynamic balancing' },
  { name: 'Full Vehicle Inspection', basePrice: 800, category: 'General', description: 'Comprehensive 50-point vehicle inspection' },
  { name: 'Coolant Flush', basePrice: 600, category: 'Engine', description: 'Cooling system flush and refill' },
  { name: 'Fuel System Cleaning', basePrice: 900, category: 'Engine', description: 'Fuel injector and system cleaning' },
  { name: 'Exhaust Repair', basePrice: 1200, category: 'Exhaust', description: 'Exhaust pipe and muffler repair' },
  { name: 'Gear Box Repair', basePrice: 4000, category: 'Transmission', description: 'Gearbox diagnosis and repair' },
  { name: 'Radiator Repair', basePrice: 1800, category: 'Cooling', description: 'Radiator leak repair or replacement' },
  { name: 'Headlight/Taillight Repair', basePrice: 600, category: 'Electrical', description: 'Headlight or taillight repair and alignment' },
  { name: 'General Service', basePrice: 1500, category: 'General', description: 'Standard periodic vehicle service' },
];

const parts = [
  { name: 'Engine Oil (per litre)', unitPrice: 350, category: 'Fluids', unit: 'litre' },
  { name: 'Gear Oil', unitPrice: 280, category: 'Fluids', unit: 'litre' },
  { name: 'Brake Fluid', unitPrice: 180, category: 'Fluids', unit: 'litre' },
  { name: 'Coolant', unitPrice: 220, category: 'Fluids', unit: 'litre' },
  { name: 'Transmission Fluid', unitPrice: 320, category: 'Fluids', unit: 'litre' },
  { name: 'Power Steering Fluid', unitPrice: 260, category: 'Fluids', unit: 'litre' },
  { name: 'Brake Pads (set)', unitPrice: 850, category: 'Brakes', unit: 'set' },
  { name: 'Brake Shoes', unitPrice: 650, category: 'Brakes', unit: 'set' },
  { name: 'Brake Disc', unitPrice: 1200, category: 'Brakes', unit: 'piece' },
  { name: 'Clutch Plate', unitPrice: 900, category: 'Transmission', unit: 'piece' },
  { name: 'Clutch Kit', unitPrice: 2200, category: 'Transmission', unit: 'set' },
  { name: 'Air Filter', unitPrice: 350, category: 'Filters', unit: 'piece' },
  { name: 'Oil Filter', unitPrice: 180, category: 'Filters', unit: 'piece' },
  { name: 'Fuel Filter', unitPrice: 280, category: 'Filters', unit: 'piece' },
  { name: 'Cabin Filter', unitPrice: 320, category: 'Filters', unit: 'piece' },
  { name: 'Spark Plugs', unitPrice: 220, category: 'Ignition', unit: 'piece' },
  { name: 'Ignition Coil', unitPrice: 750, category: 'Ignition', unit: 'piece' },
  { name: 'Car Battery', unitPrice: 3500, category: 'Electrical', unit: 'piece' },
  { name: 'Tyre (per unit)', unitPrice: 3200, category: 'Tyres', unit: 'piece' },
  { name: 'Tube (per unit)', unitPrice: 450, category: 'Tyres', unit: 'piece' },
  { name: 'Wiper Blades', unitPrice: 380, category: 'Body', unit: 'piece' },
  { name: 'Headlight Bulb', unitPrice: 280, category: 'Electrical', unit: 'piece' },
  { name: 'Taillight Bulb', unitPrice: 180, category: 'Electrical', unit: 'piece' },
  { name: 'Radiator Cap', unitPrice: 220, category: 'Cooling', unit: 'piece' },
  { name: 'Thermostat', unitPrice: 480, category: 'Cooling', unit: 'piece' },
  { name: 'Water Pump', unitPrice: 1800, category: 'Cooling', unit: 'piece' },
  { name: 'Fan Belt', unitPrice: 420, category: 'Engine', unit: 'piece' },
  { name: 'Timing Belt', unitPrice: 850, category: 'Engine', unit: 'piece' },
  { name: 'Timing Chain Kit', unitPrice: 3200, category: 'Engine', unit: 'set' },
  { name: 'CV Joint', unitPrice: 1400, category: 'Drivetrain', unit: 'piece' },
  { name: 'Shock Absorber', unitPrice: 2200, category: 'Suspension', unit: 'piece' },
  { name: 'Strut Assembly', unitPrice: 3500, category: 'Suspension', unit: 'piece' },
  { name: 'Ball Joint', unitPrice: 850, category: 'Suspension', unit: 'piece' },
  { name: 'Tie Rod End', unitPrice: 680, category: 'Steering', unit: 'piece' },
  { name: 'Serpentine Belt', unitPrice: 620, category: 'Engine', unit: 'piece' },
  { name: 'Fuse Set', unitPrice: 120, category: 'Electrical', unit: 'set' },
  { name: 'Relay Switch', unitPrice: 180, category: 'Electrical', unit: 'piece' },
  { name: 'Oxygen Sensor', unitPrice: 1200, category: 'Sensors', unit: 'piece' },
  { name: 'MAF Sensor', unitPrice: 1800, category: 'Sensors', unit: 'piece' },
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
