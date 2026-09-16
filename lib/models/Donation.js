import mongoose from "mongoose";

const AllocationSchema = new mongoose.Schema(
  {
    program: { type: String, trim: true },
    date: { type: Date },
    note: { type: String, trim: true },
    allocatedAt: { type: Date },
  },
  { _id: false }
);

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "INR" },
    mode: {
      type: String,
      enum: ["cash", "bank_transfer", "upi", "cheque", "razorpay", "other"],
      default: "cash",
    },
    program: { type: String, trim: true, default: "general" },
    date: { type: Date, required: true, default: Date.now },
    referenceNote: { type: String, trim: true },

    // Online (Razorpay) donations
    source: { type: String, enum: ["manual", "online"], default: "manual" },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },
    donationType: { type: String, trim: true },
    category: { type: String, trim: true },
    donorAddress: { type: String, trim: true },
    donorMobile2: { type: String, trim: true },
    suggestion: { type: String, trim: true },
    razorpayOrderId: { type: String, trim: true, index: true },
    razorpayPaymentId: { type: String, trim: true },
    razorpaySignature: { type: String, trim: true },

    receiptNumber: { type: String, trim: true, unique: true, sparse: true },
    receiptEmailSentAt: { type: Date },

    // Where the admin later designates this money went, and when.
    allocation: { type: AllocationSchema, default: undefined },
  },
  { timestamps: true }
);

DonationSchema.index({ date: -1 });
DonationSchema.index({ donor: 1, date: -1 });

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
