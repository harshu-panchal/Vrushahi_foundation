import mongoose from "mongoose";

const VolunteerSignupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    interest: { type: String, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "onboarded", "archived"],
      default: "new",
    },
  },
  { timestamps: true }
);

VolunteerSignupSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.VolunteerSignup ||
  mongoose.model("VolunteerSignup", VolunteerSignupSchema);
