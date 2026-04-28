import mongoose from "mongoose";

const repairJobSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairRequest",
      required: true,
    },
    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    servicesUsed: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        name: String,
        price: Number,
      },
    ],
    partsUsed: [
      {
        partId: { type: mongoose.Schema.Types.ObjectId, ref: "Part" },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    laborCost: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    discountAmount: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    adminApprovedCost: Number,
    jobStatus: { type: String, default: "InProgress" },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    billSubmitted: { type: Boolean, default: false },
    invoiceUrl: String,
  },
  { timestamps: true },
);

export default mongoose.model("RepairJob", repairJobSchema);
