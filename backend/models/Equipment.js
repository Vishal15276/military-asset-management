import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    base: { type: String, required: true },
  },
  { timestamps: true }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;
