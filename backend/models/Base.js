import mongoose from 'mongoose';

const baseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Base', baseSchema);
