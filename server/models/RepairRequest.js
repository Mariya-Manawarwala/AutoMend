import mongoose from "mongoose";

const repairRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      brand: { type: String, required: true },
      model: { type: String, required: true },
      image: String,
    },
    description: { type: String, required: true },
    serviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    serviceType: {
      type: String,
      required: true,
    },
    location: {
      address: String,
      lat: Number,
      lng: Number,
    },
    scheduledDate: Date,
    priority: {
      type: String,
      default: "normal",
    },
    status: { type: String, default: "Pending" },
    assignedMechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acceptedAt: Date,
    estimatedCost: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("RepairRequest", repairRequestSchema);
