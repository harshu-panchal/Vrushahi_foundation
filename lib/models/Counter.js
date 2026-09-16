import mongoose from "mongoose";

// Simple atomic-increment counters, e.g. "receipt-2026" -> running receipt
// number for that calendar year.
const CounterSchema = new mongoose.Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 },
});

export default mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
