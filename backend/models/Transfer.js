import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    equipmentType: { type: String, required: true },
    quantity: { type: Number, required: true },
    fromBase: { type: String, required: true },
    toBase: { type: String, required: true },
    notes: { type: String },
    expectedArrival: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Transfer", transferSchema);
