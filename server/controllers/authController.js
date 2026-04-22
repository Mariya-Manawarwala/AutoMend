import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    garageAddress,
    openingTime,
    closingTime,
    contactInfo,
    serviceRange,
    adminId,
  } = req.body;

  if (!name || !email || !phone || !password || !role) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const userData = {
    name,
    email,
    phone,
    password,
    role,
    fullName: name,
    emailId: email,
  };

  if (role === "admin") {
    userData.garageAddress = garageAddress;
    userData.openingTime = openingTime;
    userData.closingTime = closingTime;
    userData.contactInfo = contactInfo;
    userData.serviceRange = serviceRange;
  }

  if (role === "mechanic") {
    if (!adminId) {
      res.status(400);
      throw new Error("Mechanic must provide an adminId");
    }
    const adminExists = await User.findOne({ _id: adminId, role: "admin" });
    if (!adminExists) {
      res.status(400);
      throw new Error("Invalid adminId provided");
    }
    userData.adminId = adminId;
    userData.skills = [];
    userData.mechanicWallet = { dueBalance: 0 };
  }

  if (role === "customer") {
    userData.vehiclesOwned = [];
  }

  const user = await User.create(userData);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

export const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;

  if (!password || (!email && !phone)) {
    res.status(400);
    throw new Error("Please provide email/phone and password");
  }

  const query = email ? { email } : { phone };
  const user = await User.findOne(query);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
};
