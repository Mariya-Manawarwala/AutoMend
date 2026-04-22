import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    numberPlate: { type: String, required: true, unique: true },
    fuelType: { type: String, required: true },
    yearBought: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Vehicle", vehicleSchema);
