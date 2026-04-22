import mongoose from "mongoose";

const repairRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    problemDescription: { type: String, required: true },
    serviceType: {
      type: String,
      enum: ["HomeService", "GarageVisit"],
      required: true,
    },
    customerAddress: String,
    status: { type: String, default: "Pending" },
    assignedMechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acceptedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("RepairRequest", repairRequestSchema);
