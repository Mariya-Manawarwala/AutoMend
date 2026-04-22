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

    fullName: String,
    address: String,
    emailId: String,
    dateOfBirth: Date,
    profilePhoto: String,
    dateJoined: { type: Date, default: Date.now },

    // Admin Fields
    garageAddress: String,
    openingTime: String,
    closingTime: String,
    contactInfo: {
      phone: String,
      altPhone: String,
      email: String,
      website: String,
      instagram: String,
    },
    serviceRange: Number,

    // Mechanic Fields
    skills: [String],
    mechanicWallet: { dueBalance: { type: Number, default: 0 } },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Customer Fields
    vehiclesOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
