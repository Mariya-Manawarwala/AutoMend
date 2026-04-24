// ==========================================
// AutoMend — Centralized Mock Data
// ==========================================
import React from 'react';
import { 
  Wrench, 
  Car, 
  Battery, 
  Wind, 
  Settings, 
  PenTool, 
  Target,
  CircleDollarSign,
  Bell,
  Star,
  ClipboardList,
  Gift
} from "lucide-react";

export const mockUsers = {
  customer: {
    id: 1,
    name: "Arjun Sharma",
    email: "arjun@example.com",
    phone: "9876543210",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    address: "Andheri West, Mumbai, Maharashtra",
    dateJoined: "2026-01-15",
    vehiclesOwned: [1, 2],
  },
  mechanic: {
    id: 2,
    name: "Rajesh Kumar",
    email: "rajesh@automend.com",
    phone: "9123456789",
    role: "mechanic",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    skills: ["Engine Repair", "Tire Service", "Oil Change", "Brake Systems", "AC Repair"],
    rating: 4.8,
    jobsCompleted: 127,
    dueBalance: 2500,
    dateJoined: "2025-06-10",
    availability: "Available",
  },
  admin: {
    id: 3,
    name: "Priya Malhotra",
    email: "admin@automend.com",
    phone: "9555666777",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    garageAddress: "MG Road, Bangalore, Karnataka",
    dateJoined: "2024-03-01",
  },
};

export const mockVehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Fortuner",
    year: 2022,
    licensePlate: "MH-01-AB-1234",
    color: "White",
    fuelType: "Diesel",
    mileage: 45000,
    owner: 1,
    image: "https://images.unsplash.com/photo-1625231334401-68eb8e598c4b?w=400&h=250&fit=crop",
    lastService: "2026-03-15",
  },
  {
    id: 2,
    make: "Honda",
    model: "City",
    year: 2023,
    licensePlate: "MH-01-CD-5678",
    color: "Silver",
    fuelType: "Petrol",
    mileage: 18000,
    owner: 1,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop",
    lastService: "2026-04-01",
  },
  {
    id: 3,
    make: "Royal Enfield",
    model: "Classic 350",
    year: 2024,
    licensePlate: "KA-05-EF-9012",
    color: "Black",
    fuelType: "Petrol",
    mileage: 8000,
    owner: 1,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop",
    lastService: "2026-02-20",
  },
];

export const mockServices = [
  { id: 1, name: "Oil Change", description: "Full synthetic oil change with filter replacement", basePrice: 1500, category: "Maintenance", duration: "1 hour", icon: <Car size={48} /> },
  { id: 2, name: "Tire Replacement", description: "Complete tire replacement with balancing", basePrice: 4000, category: "Tire Service", duration: "2 hours", icon: <Settings size={48} /> },
  { id: 3, name: "Engine Repair", description: "Full engine diagnostics and repair", basePrice: 8000, category: "Engine", duration: "1-3 days", icon: <Wrench size={48} /> },
  { id: 4, name: "Brake Service", description: "Brake pad replacement and system check", basePrice: 3000, category: "Brakes", duration: "3 hours", icon: <Target size={48} /> },
  { id: 5, name: "AC Repair", description: "Air conditioning system repair and gas refill", basePrice: 2500, category: "Electrical", duration: "4 hours", icon: <Wind size={48} /> },
  { id: 6, name: "Battery Replacement", description: "Car battery testing and replacement", basePrice: 5000, category: "Electrical", duration: "1 hour", icon: <Battery size={48} /> },
  { id: 7, name: "Full Service", description: "Complete vehicle inspection and servicing", basePrice: 6000, category: "Maintenance", duration: "1 day", icon: <Car size={48} /> },
  { id: 8, name: "Wheel Alignment", description: "Computerized wheel alignment", basePrice: 1200, category: "Tire Service", duration: "1 hour", icon: <PenTool size={48} /> },
];

export const mockRequests = [
  {
    id: 1,
    customer: 1,
    customerName: "Arjun Sharma",
    vehicle: 1,
    vehicleName: "Toyota Fortuner",
    licensePlate: "MH-01-AB-1234",
    service: 1,
    serviceName: "Oil Change",
    status: "completed",
    priority: "normal",
    description: "Regular scheduled oil change at 45000 km.",
    createdAt: "2026-04-10",
    updatedAt: "2026-04-12",
    estimatedCost: 1500,
    finalCost: 1500,
    assignedMechanic: "Rajesh Kumar",
  },
  {
    id: 2,
    customer: 1,
    customerName: "Arjun Sharma",
    vehicle: 2,
    vehicleName: "Honda City",
    licensePlate: "MH-01-CD-5678",
    service: 2,
    serviceName: "Tire Replacement",
    status: "in-progress",
    priority: "high",
    description: "Front left tire has a bulge. Needs immediate replacement along with alignment.",
    createdAt: "2026-04-18",
    updatedAt: "2026-04-20",
    estimatedCost: 4000,
    finalCost: null,
    assignedMechanic: "Rajesh Kumar",
  },
  {
    id: 3,
    customer: 1,
    customerName: "Arjun Sharma",
    vehicle: 1,
    vehicleName: "Toyota Fortuner",
    licensePlate: "MH-01-AB-1234",
    service: 3,
    serviceName: "Engine Repair",
    status: "pending",
    priority: "urgent",
    description: "Engine making unusual rattling noise when idle. Check engine light is on.",
    createdAt: "2026-04-22",
    updatedAt: "2026-04-22",
    estimatedCost: 8000,
    finalCost: null,
    assignedMechanic: null,
  },
  {
    id: 4,
    customer: 1,
    customerName: "Arjun Sharma",
    vehicle: 2,
    vehicleName: "Honda City",
    licensePlate: "MH-01-CD-5678",
    service: 4,
    serviceName: "Brake Service",
    status: "completed",
    priority: "high",
    description: "Squeaking noise from front brakes during stopping.",
    createdAt: "2026-03-28",
    updatedAt: "2026-03-30",
    estimatedCost: 3000,
    finalCost: 3200,
    assignedMechanic: "Rajesh Kumar",
  },
  {
    id: 5,
    customer: 1,
    customerName: "Arjun Sharma",
    vehicle: 3,
    vehicleName: "Royal Enfield Classic 350",
    licensePlate: "KA-05-EF-9012",
    service: 7,
    serviceName: "Full Service",
    status: "queued",
    priority: "normal",
    description: "Annual full service and inspection.",
    createdAt: "2026-04-21",
    updatedAt: "2026-04-21",
    estimatedCost: 6000,
    finalCost: null,
    assignedMechanic: null,
  },
];

export const mockJobs = [
  {
    id: 1,
    requestId: 1,
    assignedMechanic: 2,
    mechanicName: "Rajesh Kumar",
    customerName: "Arjun Sharma",
    vehicleName: "Toyota Fortuner",
    licensePlate: "MH-01-AB-1234",
    serviceName: "Oil Change",
    status: "completed",
    priority: "normal",
    notes: "Replaced synthetic oil and oil filter. Engine running smooth.",
    partsUsed: [
      { name: "Castrol EDGE 5W-30 (4L)", qty: 1, cost: 800 },
      { name: "Oil Filter - Toyota OEM", qty: 1, cost: 350 },
    ],
    startDate: "2026-04-10",
    completedDate: "2026-04-12",
    estimatedCost: 1500,
    laborCost: 350,
  },
  {
    id: 2,
    requestId: 2,
    assignedMechanic: 2,
    mechanicName: "Rajesh Kumar",
    customerName: "Arjun Sharma",
    vehicleName: "Honda City",
    licensePlate: "MH-01-CD-5678",
    serviceName: "Tire Replacement",
    status: "in-progress",
    priority: "high",
    notes: "Removing old front-left tire. Waiting for MRF ZLX to arrive from warehouse.",
    partsUsed: [
      { name: "MRF ZLX 185/65 R15", qty: 1, cost: 3200 },
    ],
    startDate: "2026-04-20",
    completedDate: null,
    estimatedCost: 4000,
    laborCost: 500,
  },
  {
    id: 3,
    requestId: 4,
    assignedMechanic: 2,
    mechanicName: "Rajesh Kumar",
    customerName: "Arjun Sharma",
    vehicleName: "Honda City",
    licensePlate: "MH-01-CD-5678",
    serviceName: "Brake Service",
    status: "completed",
    priority: "high",
    notes: "Replaced front brake pads. Rotors are within spec. Brake fluid topped up.",
    partsUsed: [
      { name: "Bosch Brake Pads (Front)", qty: 1, cost: 1800 },
      { name: "Brake Fluid DOT4 (500ml)", qty: 1, cost: 400 },
    ],
    startDate: "2026-03-28",
    completedDate: "2026-03-30",
    estimatedCost: 3000,
    laborCost: 1000,
  },
];

export const mockPayments = [
  { id: 1, requestId: 1, jobId: 1, customerName: "Arjun Sharma", serviceName: "Oil Change", amount: 1500, status: "completed", paymentMethod: "UPI", transactionId: "TXN2026041200001", date: "2026-04-12" },
  { id: 2, requestId: 4, jobId: 3, customerName: "Arjun Sharma", serviceName: "Brake Service", amount: 3200, status: "completed", paymentMethod: "Card", transactionId: "TXN2026033000002", date: "2026-03-30" },
  { id: 3, requestId: 2, jobId: 2, customerName: "Arjun Sharma", serviceName: "Tire Replacement", amount: 4000, status: "pending", paymentMethod: null, transactionId: null, date: null },
];

export const mockReviews = [
  { id: 1, requestId: 1, customerName: "Arjun Sharma", mechanicName: "Rajesh Kumar", serviceName: "Oil Change", rating: 5, comment: "Excellent service! Quick turnaround and very professional.", date: "2026-04-13" },
  { id: 2, requestId: 4, customerName: "Arjun Sharma", mechanicName: "Rajesh Kumar", serviceName: "Brake Service", rating: 4, comment: "Good work on the brakes. Slightly pricier than expected but quality is great.", date: "2026-04-01" },
  { id: 3, requestId: 0, customerName: "Sneha Patel", mechanicName: "Rajesh Kumar", serviceName: "AC Repair", rating: 5, comment: "AC is blowing ice cold now! Thank you Rajesh sir.", date: "2026-03-20" },
  { id: 4, requestId: 0, customerName: "Vikram Singh", mechanicName: "Rajesh Kumar", serviceName: "Engine Repair", rating: 4, comment: "Took a bit longer but the engine is running perfectly now.", date: "2026-03-10" },
];

export const mockNotifications = [
  { id: 1, type: "status_update", title: "Request Updated", message: "Your tire replacement request is now in progress.", read: false, date: "2026-04-20T14:30:00", icon: <Bell size={16} /> },
  { id: 2, type: "payment", title: "Payment Received", message: "Payment of ₹1,500 received for Oil Change service.", read: true, date: "2026-04-12T10:00:00", icon: <CircleDollarSign size={16} /> },
  { id: 3, type: "assignment", title: "New Job Assigned", message: "You have been assigned a new Brake Service job.", read: false, date: "2026-04-22T09:15:00", icon: <Wrench size={16} /> },
  { id: 4, type: "reminder", title: "Service Reminder", message: "Your Toyota Fortuner is due for its next scheduled service.", read: false, date: "2026-04-21T08:00:00", icon: <ClipboardList size={16} /> },
  { id: 5, type: "promotion", title: "Special Offer!", message: "Get 15% off on Full Service this month. Use code: AUTO15", read: true, date: "2026-04-18T12:00:00", icon: <Gift size={16} /> },
  { id: 6, type: "review", title: "Review Reminder", message: "Please rate your recent Brake Service experience.", read: false, date: "2026-04-01T16:00:00", icon: <Star size={16} /> },
];

export const mockChatMessages = [
  { id: 1, sender: "user", message: "Hi, I need help with my car's engine noise.", timestamp: "2026-04-22T10:00:00" },
  { id: 2, sender: "bot", message: "Hello Arjun! I'd be happy to help. Can you describe the noise? Is it a rattling, knocking, or whining sound?", timestamp: "2026-04-22T10:00:05" },
  { id: 3, sender: "user", message: "It's a rattling noise when the engine is idle.", timestamp: "2026-04-22T10:01:00" },
  { id: 4, sender: "bot", message: "A rattling noise at idle could indicate several things:\n\n1. **Loose heat shield** - Common and inexpensive fix\n2. **Worn timing chain** - More serious, needs inspection\n3. **Low oil level** - Check your dipstick\n\nI'd recommend creating a repair request so our mechanic can diagnose it in person. Would you like me to help you create one?", timestamp: "2026-04-22T10:01:10" },
  { id: 5, sender: "user", message: "Yes, please help me create a request.", timestamp: "2026-04-22T10:02:00" },
  { id: 6, sender: "bot", message: "I've noted your concern. You can create a new repair request from your dashboard by clicking 'Create New Request'. Select your Toyota Fortuner and choose 'Engine Repair' as the service type. Make sure to describe the rattling noise in the description!\n\nIs there anything else I can help with?", timestamp: "2026-04-22T10:02:08" },
];

export const mockCoupons = [
  { id: 1, code: "AUTO15", discount: 15, type: "percentage", description: "15% off on all services", validFrom: "2026-04-01", validUntil: "2026-04-30", maxUses: 100, currentUses: 42, isActive: true, minOrderValue: 1000 },
  { id: 2, code: "FIRST500", discount: 500, type: "flat", description: "₹500 off for first-time customers", validFrom: "2026-01-01", validUntil: "2026-12-31", maxUses: 500, currentUses: 189, isActive: true, minOrderValue: 2000 },
  { id: 3, code: "ENGINE20", discount: 20, type: "percentage", description: "20% off on engine repairs", validFrom: "2026-04-15", validUntil: "2026-05-15", maxUses: 50, currentUses: 12, isActive: true, minOrderValue: 3000 },
  { id: 4, code: "SUMMER10", discount: 10, type: "percentage", description: "Summer AC service special", validFrom: "2026-03-01", validUntil: "2026-03-31", maxUses: 200, currentUses: 200, isActive: false, minOrderValue: 500 },
];

export const mockParts = [
  { id: 1, name: "Castrol EDGE 5W-30 (4L)", category: "Engine Oil", stock: 24, unitPrice: 800, supplier: "Castrol India", minStock: 10 },
  { id: 2, name: "Oil Filter - Toyota OEM", category: "Filters", stock: 15, unitPrice: 350, supplier: "Toyota Parts", minStock: 5 },
  { id: 3, name: "MRF ZLX 185/65 R15", category: "Tires", stock: 8, unitPrice: 3200, supplier: "MRF Ltd", minStock: 4 },
  { id: 4, name: "Bosch Brake Pads (Front)", category: "Brakes", stock: 12, unitPrice: 1800, supplier: "Bosch India", minStock: 6 },
  { id: 5, name: "Brake Fluid DOT4 (500ml)", category: "Fluids", stock: 30, unitPrice: 400, supplier: "Valvoline", minStock: 10 },
  { id: 6, name: "AC Compressor - Universal", category: "AC Parts", stock: 3, unitPrice: 6500, supplier: "Denso India", minStock: 2 },
  { id: 7, name: "Amaron Battery 12V 65Ah", category: "Batteries", stock: 6, unitPrice: 4800, supplier: "Amaron", minStock: 3 },
  { id: 8, name: "Spark Plug - Iridium", category: "Engine Parts", stock: 40, unitPrice: 450, supplier: "NGK", minStock: 15 },
  { id: 9, name: "Air Filter - Universal", category: "Filters", stock: 18, unitPrice: 600, supplier: "K&N India", minStock: 8 },
  { id: 10, name: "Coolant (1L)", category: "Fluids", stock: 22, unitPrice: 350, supplier: "Shell India", minStock: 10 },
];

export const mockMechanics = [
  {
    id: 2,
    name: "Rajesh Kumar",
    email: "rajesh@automend.com",
    phone: "9123456789",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    skills: ["Engine Repair", "Tire Service", "Oil Change", "Brake Systems", "AC Repair"],
    rating: 4.8,
    jobsCompleted: 127,
    activeJobs: 1,
    availability: "Available",
    dateJoined: "2025-06-10",
  },
  {
    id: 4,
    name: "Sunil Yadav",
    email: "sunil@automend.com",
    phone: "9234567890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    skills: ["AC Repair", "Electrical Systems", "Battery Service"],
    rating: 4.5,
    jobsCompleted: 89,
    activeJobs: 2,
    availability: "Busy",
    dateJoined: "2025-08-20",
  },
  {
    id: 5,
    name: "Mohammed Irfan",
    email: "irfan@automend.com",
    phone: "9345678901",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    skills: ["Full Service", "Engine Diagnostics", "Transmission"],
    rating: 4.9,
    jobsCompleted: 203,
    activeJobs: 0,
    availability: "Available",
    dateJoined: "2024-11-05",
  },
  {
    id: 6,
    name: "Deepak Patil",
    email: "deepak@automend.com",
    phone: "9456789012",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    skills: ["Tire Service", "Wheel Alignment", "Suspension"],
    rating: 4.6,
    jobsCompleted: 156,
    activeJobs: 1,
    availability: "Available",
    dateJoined: "2025-02-14",
  },
];

export const mockAllUsers = [
  { id: 1, name: "Arjun Sharma", email: "arjun@example.com", role: "customer", status: "active", dateJoined: "2026-01-15" },
  { id: 2, name: "Rajesh Kumar", email: "rajesh@automend.com", role: "mechanic", status: "active", dateJoined: "2025-06-10" },
  { id: 3, name: "Priya Malhotra", email: "admin@automend.com", role: "admin", status: "active", dateJoined: "2024-03-01" },
  { id: 4, name: "Sunil Yadav", email: "sunil@automend.com", role: "mechanic", status: "active", dateJoined: "2025-08-20" },
  { id: 5, name: "Mohammed Irfan", email: "irfan@automend.com", role: "mechanic", status: "active", dateJoined: "2024-11-05" },
  { id: 6, name: "Deepak Patil", email: "deepak@automend.com", role: "mechanic", status: "active", dateJoined: "2025-02-14" },
  { id: 7, name: "Sneha Patel", email: "sneha@example.com", role: "customer", status: "active", dateJoined: "2025-09-01" },
  { id: 8, name: "Vikram Singh", email: "vikram@example.com", role: "customer", status: "inactive", dateJoined: "2025-04-22" },
];

export const mockAdminStats = {
  totalRequests: 147,
  pendingApproval: 12,
  inProgress: 23,
  completed: 98,
  totalRevenue: 485000,
  avgJobTime: "2.3 days",
  totalMechanics: 4,
  totalCustomers: 52,
  averageRating: 4.7,
  monthlyGrowth: 18,
};

export const mockWeeklyData = [
  { day: "Mon", requests: 8, completed: 5, revenue: 12000 },
  { day: "Tue", requests: 12, completed: 9, revenue: 18500 },
  { day: "Wed", requests: 6, completed: 4, revenue: 9000 },
  { day: "Thu", requests: 15, completed: 11, revenue: 24000 },
  { day: "Fri", requests: 10, completed: 8, revenue: 16500 },
  { day: "Sat", requests: 18, completed: 14, revenue: 32000 },
  { day: "Sun", requests: 4, completed: 3, revenue: 6000 },
];

export const mockMonthlyRevenue = [
  { month: "Jan", revenue: 85000 },
  { month: "Feb", revenue: 92000 },
  { month: "Mar", revenue: 110000 },
  { month: "Apr", revenue: 125000 },
];

export const mockServiceDistribution = [
  { name: "Oil Change", value: 35, color: "#D4AF37" },
  { name: "Tire Service", value: 20, color: "#D4A574" },
  { name: "Engine Repair", value: 15, color: "#E8D5B7" },
  { name: "Brake Service", value: 12, color: "#A89968" },
  { name: "AC Repair", value: 10, color: "#D9C7A8" },
  { name: "Others", value: 8, color: "#5A5147" },
];

// ==========================================
// PUBLIC WEBSITE MOCK DATA
// ==========================================

export const mockFleet = [
  { id: 1, name: "Mercedes Benz S Class", type: "Sedan", category: "Luxury", seats: 4, transmission: "Automatic", fuel: "Petrol", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop" },
  { id: 2, name: "Mercedes Benz V Class", type: "Van", category: "Business", seats: 7, transmission: "Automatic", fuel: "Diesel", image: "https://images.unsplash.com/photo-1570294646112-27ce4f174e4b?w=600&h=400&fit=crop" },
  { id: 3, name: "Audi A8", type: "Sedan", category: "Luxury", seats: 4, transmission: "Automatic", fuel: "Petrol", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop" },
  { id: 4, name: "BMW 7 Series", type: "Sedan", category: "Luxury", seats: 4, transmission: "Automatic", fuel: "Diesel", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop" },
  { id: 5, name: "Toyota Innova Crysta", type: "MPV", category: "Economy", seats: 7, transmission: "Automatic", fuel: "Diesel", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=600&h=400&fit=crop" },
  { id: 6, name: "Range Rover Velar", type: "SUV", category: "Business", seats: 5, transmission: "Automatic", fuel: "Petrol", image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop" },
];

export const mockFeatures = [
  { icon: "🛡️", title: "Safety First", description: "Experienced staff and professionally trained mechanics ensure your vehicle is in the safest hands." },
  { icon: "💰", title: "Reasonable Rates", description: "We offer you the right service at the right price. No hidden costs, complete transparency." },
  { icon: "🚗", title: "Largest Fleet", description: "Our extensive service network covers all major vehicle brands and models." },
  { icon: "🌍", title: "Nationwide Service", description: "With service centers across major cities, we're always near you when you need us." },
];

export const mockSiteStats = [
  { stat: "+80k", label: "Customers Served" },
  { stat: "20+", label: "Years Experience" },
  { stat: "500+", label: "Vehicles Serviced Monthly" },
  { stat: "24/7", label: "Customer Support" },
];

export const mockBlogPosts = [
  { id: 1, title: "Tips for Professional Car Maintenance", excerpt: "Regular maintenance is the key to a long-lasting vehicle. Learn the top tips every car owner should know.", content: "Regular maintenance is crucial for keeping your vehicle running smoothly. Start with regular oil changes every 5,000-7,500 km depending on your driving habits. Check tire pressure monthly and rotate tires every 10,000 km. Don't ignore warning lights on your dashboard – they're there for a reason. Keep your car clean, both inside and out, to prevent rust and deterioration. Schedule regular inspections with a trusted mechanic.", category: "Maintenance", date: "2026-04-20", readTime: "5 min", image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop", author: "Priya Malhotra" },
  { id: 2, title: "Understanding Your Vehicle's Engine", excerpt: "A comprehensive guide to understanding how your car's engine works and common issues to watch for.", content: "Your car's engine is the heart of your vehicle. Understanding how it works can help you identify problems early. The engine converts fuel into motion through a series of small explosions. Key components include pistons, cylinders, spark plugs, and the crankshaft. Common issues include overheating, oil leaks, and unusual noises. Regular oil changes and timely servicing can prevent most engine problems.", category: "Education", date: "2026-04-15", readTime: "8 min", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", author: "Rajesh Kumar" },
  { id: 3, title: "Monsoon Driving Safety Guide", excerpt: "Essential tips for safe driving during the monsoon season in India.", content: "Monsoon driving requires extra precaution. Ensure your wipers are in good condition and your tires have adequate tread depth. Maintain a safe following distance and avoid sudden braking. Turn on your headlights in heavy rain for better visibility. Check your brakes before monsoon season begins. Avoid driving through waterlogged areas and always carry an emergency kit.", category: "Safety", date: "2026-04-10", readTime: "6 min", image: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=600&h=400&fit=crop", author: "Priya Malhotra" },
  { id: 4, title: "Electric Vehicles: The Future of Driving", excerpt: "How EVs are changing the automotive landscape in India and what it means for service centers.", content: "Electric vehicles are rapidly gaining popularity in India. With government incentives and improving infrastructure, EVs are becoming a practical choice for many. While EVs require less maintenance than traditional vehicles, they still need regular check-ups for battery health, tire condition, and brake systems. At AutoMend, we're investing in EV-specific training and equipment to serve this growing market.", category: "Industry", date: "2026-04-05", readTime: "7 min", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=400&fit=crop", author: "Priya Malhotra" },
  { id: 5, title: "DIY vs Professional Repair: What You Should Know", excerpt: "When should you fix it yourself and when should you call the pros? Here's our honest guide.", content: "Some repairs are safe to do yourself: changing wipers, replacing air filters, and topping off fluids. However, brake work, engine repairs, electrical issues, and anything involving the transmission should always be handled by professionals. Attempting complex repairs without proper knowledge can lead to safety hazards and more expensive fixes down the road.", category: "Tips", date: "2026-03-28", readTime: "4 min", image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop", author: "Rajesh Kumar" },
  { id: 6, title: "How to Choose the Right Motor Oil", excerpt: "A complete breakdown of motor oil types, grades, and which one is best for your vehicle.", content: "Motor oil is essential for engine lubrication. The most common types are conventional, synthetic blend, and full synthetic. The grade (like 5W-30) indicates viscosity at different temperatures. Check your owner's manual for the recommended grade. Synthetic oils offer better performance and protection but cost more. For Indian conditions, 5W-30 or 10W-40 are commonly recommended.", category: "Education", date: "2026-03-20", readTime: "5 min", image: "https://images.unsplash.com/photo-1635784439498-98da59975bdb?w=600&h=400&fit=crop", author: "Rajesh Kumar" },
];

export const mockTestimonials = [
  { id: 1, name: "Arjun Sharma", role: "Business Owner", rating: 5, text: "AutoMend has transformed how I manage my fleet. The service quality and turnaround time is exceptional. Highly recommend!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "Sneha Patel", role: "Software Engineer", rating: 5, text: "The AI chatbot diagnosed my car issue before I even visited. Saved me time and money. Truly innovative!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Vikram Singh", role: "Doctor", rating: 4, text: "Professional service, transparent pricing, and they keep me updated at every step. My go-to garage now.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: 4, name: "Priya Desai", role: "Architect", rating: 5, text: "I love how I can track my repair status in real-time. The whole experience feels premium.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: 5, name: "Rahul Menon", role: "Teacher", rating: 5, text: "Been a customer for 2 years. Consistent quality and the team genuinely cares about your vehicle.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: 6, name: "Anita Joshi", role: "Entrepreneur", rating: 4, text: "Great service center. The online booking system is super convenient. Would love a home pickup option!", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
];

export const mockTeamMembers = [
  { id: 1, name: "Priya Malhotra", role: "Founder & CEO", bio: "With 20+ years in the automotive industry, Priya founded AutoMend to revolutionize garage management.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face" },
  { id: 2, name: "Rajesh Kumar", role: "Head Mechanic", bio: "Master mechanic with expertise in all major brands. Rajesh leads our technical team with precision.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face" },
  { id: 3, name: "Mohammed Irfan", role: "Operations Manager", bio: "Ensures seamless operations across all service centers. Known for his efficiency and attention to detail.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
  { id: 4, name: "Deepak Patil", role: "Customer Relations", bio: "Dedicated to ensuring every customer has a premium experience from booking to pickup.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face" },
];

export const mockFAQs = [
  { q: "How do I book a service?", a: "You can book a service online through our website or app. Simply select your vehicle, choose a service, and pick a convenient time slot. You can also call us or walk in." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and cash payments. All online payments are secured with encryption." },
  { q: "How long does a typical service take?", a: "Service duration varies: Oil changes take about 1 hour, tire services 2 hours, and major repairs 1-3 days. We'll give you an accurate estimate when you book." },
  { q: "Do you offer pickup and drop service?", a: "Yes! We offer complimentary pickup and drop for services above ₹3,000 within a 10km radius of our service centers." },
  { q: "What warranty do you provide on repairs?", a: "All repairs come with a 6-month or 10,000 km warranty (whichever comes first). Parts have their own manufacturer warranty." },
  { q: "Can I track my repair status online?", a: "Absolutely! Once logged in, you can track your repair status in real-time from your dashboard. You'll also receive SMS and email updates." },
];

