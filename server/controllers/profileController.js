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
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { fullName, address, phone, emailId, dateOfBirth, skills } = req.body;

  if (fullName) user.fullName = fullName;
  if (address) user.address = address;
  if (phone) user.phone = phone;
  if (emailId) user.emailId = emailId;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;

  if (user.role === "mechanic" && skills) {
    user.skills = skills;
  }

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    user.profilePhoto = result.secure_url;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
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
