import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { notifyAdmins } from "../utils/adminNotifier.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  const { name, email, phone, password, role, adminId, skills, address, age, experience } = req.body;

  if (!name || !email || !phone || !password || !role) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  let profilePhotoUrl = req.body.profilePhoto;

  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      profilePhotoUrl = result.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload failed during registration:", uploadError);
    }
  }

  if (role === 'mechanic' && !profilePhotoUrl) {
    res.status(400);
    throw new Error("Profile photo is mandatory for mechanics");
  }

  const userExists = await User.findOne({ email });
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
    age,
    profilePhoto: profilePhotoUrl,
    status: role === 'customer' ? 'approved' : 'pending',
    isVerified: role === 'customer'
  };

  // Add optional fields
  if (address) userData.address = address;
  if (role === 'mechanic') {
    if (skills) userData.skills = Array.isArray(skills) ? skills : [skills];
    if (experience) userData.experience = Number(experience);
    // Only add adminId if it's a non-empty string and looks like an ObjectId
    if (adminId && adminId.trim() !== "" && adminId.match(/^[0-9a-fA-F]{24}$/)) {
      userData.adminId = adminId;
    }
  }

  const user = await User.create(userData);

  if (user) {
    await notifyAdmins(`New ${user.role} registered: ${user.name}`, "new_registration", { userId: user._id });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.isOnline = true;
    user.lastSeen = Date.now();
    await user.save();

    if (user.accountStatus === "banned") {
      res.status(403);
      throw new Error("Your account has been permanently banned. Contact support.");
    }

    if (user.accountStatus === "deactivated") {
      if (user.deactivatedUntil && new Date() < user.deactivatedUntil) {
        res.status(403);
        const dateStr = new Date(user.deactivatedUntil).toLocaleDateString();
        throw new Error(`Your account is temporarily deactivated until ${dateStr}`);
      } else {
        // Automatically reactivate
        user.accountStatus = "active";
        await user.save();
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      rejectionReason: user.rejectionReason || "",
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};
