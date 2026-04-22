import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairJob",
      required: true,
      unique: true,
    },
    garageRating: { type: Number, required: true },
    garageComment: String,
    mechanicRating: { type: Number, required: true },
    mechanicComment: String,
  },
  { timestamps: true },
);

export default mongoose.model("Review", reviewSchema);
