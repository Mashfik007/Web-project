import mongoose from "mongoose";

const DigitalResource_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "author is required"],
      trim: true,
    },
    format: {
      type: String,
      enum: ["PDF", "EPUB"],
      required: [true, "format is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
    },
    fileId: {
      type: String,
      required: [true, "file is required"],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, "file name is required"],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, "size is required"],
      min: 0,
    },
    downloads: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const DigitalResource =
  mongoose.models.digital_resources ||
  mongoose.model("digital_resources", DigitalResource_schema);

export { DigitalResource, DigitalResource_schema };
