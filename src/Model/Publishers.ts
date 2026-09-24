import mongoose from "mongoose";

const Publisher_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      unique: true,
    },
    city: {
      type: String,
      required: [true, "city is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

const Publisher =
  mongoose.models.publishers || mongoose.model("publishers", Publisher_schema);

export { Publisher, Publisher_schema };
