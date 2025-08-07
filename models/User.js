import mongoose from "mongoose";

// Model for saving a user
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    verified: {
      type: String,
      enum: ["true", "false", "pending"],
      default: "false",
    },
    idCard: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    walletAddress: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    // for the plans testing
    activePlan:       { type: String, },
    planActivatedAt:  { type: Date, },
    planProfit: { type: Number },
    nextPayout:       { type: Date, }, // ← add this

  }, { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;