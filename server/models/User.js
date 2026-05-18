import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "mechanic", "customer"],
      required: true,
    },
    age: Number,
    fullName: String,
    address: String,
    emailId: String,
    dateOfBirth: Date,
    profilePhoto: String,
    dateJoined: { type: Date, default: Date.now },

    garageLocation: {
      address: String,
      lat: Number,
      lng: Number,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // System Fields
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    rejectionReason: String,
    accountStatus: {
      type: String,
      enum: ["active", "banned", "deactivated"],
      default: "active",
    },
    deactivatedUntil: { type: Date },

    // Mechanic Fields
    skills: [String],
    mechanicWallet: { dueBalance: { type: Number, default: 0 } },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 },
    isElite: { type: Boolean, default: false },

    // Customer Fields
    vehiclesOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
