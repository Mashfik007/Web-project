import mongoose from "mongoose";

const Author_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      unique: true,
    },
    nationality: {
      type: String,
      required: [true, "nationality is required"],
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

const Author =
  mongoose.models.authors || mongoose.model("authors", Author_schema);

export { Author, Author_schema };
