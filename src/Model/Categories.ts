import mongoose from "mongoose";

const Category_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
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

const Category =
  mongoose.models.categories || mongoose.model("categories", Category_schema);

export { Category, Category_schema };
