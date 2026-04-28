import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    category: { type: String, default: "General" },
    unit: { type: String, default: "piece" },
    stock: { type: Number, default: 0 },
    minStock: { type: Number, default: 5 },
    supplier: { type: String, default: "Internal" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Part", partSchema);
