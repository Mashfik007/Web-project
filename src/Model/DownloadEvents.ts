import mongoose from "mongoose";

const DownloadEvent_schema = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "",
      trim: true,
    },
    format: {
      type: String,
      enum: ["PDF", "EPUB"],
      required: true,
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    userId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
  },
  { timestamps: true },
);

const DownloadEvent =
  mongoose.models.download_events ||
  mongoose.model("download_events", DownloadEvent_schema);

export { DownloadEvent, DownloadEvent_schema };
