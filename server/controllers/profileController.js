import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("vehiclesOwned");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
};

export const updateProfile = async (req, res) => {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("PROFILE UPDATE DEBUG START");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user ? req.user._id : "UNDEFINED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const user = await User.findById(req.user._id);
    if (!user) {
      console.error("DEBUG: User not found in database");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, fullName, address, phone, emailId, dateOfBirth, skills, age } = req.body;

    // Apply updates safely
    if (name !== undefined) user.name = name;
    if (fullName !== undefined) user.fullName = fullName;
    if (address !== undefined) user.address = address;
    if (phone !== undefined) user.phone = phone;
    if (age !== undefined) user.age = Number(age) || user.age;
    
    if (emailId !== undefined && emailId !== "") {
      user.emailId = emailId;
      user.email = emailId;
    }

    if (dateOfBirth !== undefined && dateOfBirth !== "") {
      const parsedDate = new Date(dateOfBirth);
      if (!isNaN(parsedDate.getTime())) {
        user.dateOfBirth = parsedDate;
      }
    }

    // Handle skills for mechanics
    if (user.role === "mechanic" && skills !== undefined) {
      console.log("DEBUG: Processing skills for mechanic...");
      try {
        user.skills = typeof skills === "string" ? JSON.parse(skills) : skills;
      } catch (e) {
        user.skills = typeof skills === "string" ? skills.split(",").map(s => s.trim()) : skills;
      }
      console.log("DEBUG: Skills processed:", user.skills);
    }

    // Handle profile photo upload
    if (req.file) {
      console.log("DEBUG: Uploading image to Cloudinary...");
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        console.log("DEBUG: Cloudinary upload success:", result.secure_url);
        user.profilePhoto = result.secure_url;
      } catch (uploadError) {
        console.error("DEBUG: Cloudinary upload CRASHED:", uploadError);
        throw new Error("Cloudinary upload failed: " + uploadError.message);
      }
    }

    console.log("DEBUG: Attempting to save user to MongoDB...");
    const updatedUser = await user.save();
    console.log("DEBUG: UPDATED USER:", updatedUser);
    console.log("PROFILE UPDATE DEBUG END - SUCCESS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Remove password before sending back
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("PROFILE UPDATE ERROR:", error);
    console.error("STACK TRACE:", error.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    res.status(500).json({ 
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({})
    .select("-password")
    .populate("vehiclesOwned");
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("vehiclesOwned");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
};

// Public: view a mechanic's profile (no auth needed)
export const getPublicMechanicById = async (req, res) => {
  try {
    const mechanic = await User.findOne({ _id: req.params.id, role: 'mechanic' })
      .select('-password -__v');
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    res.json(mechanic);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Public: list all mechanics (for Home page / Mechanics page, no auth)
export const getPublicMechanics = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const mechanics = await User.find({ role: 'mechanic', isBlocked: { $ne: true } })
      .select('-password -__v')
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json(mechanics);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ message: "Account deleted successfully" });
};
