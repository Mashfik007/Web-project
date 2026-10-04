import mongoose from "mongoose";

const Notice_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: [true, "message is required"],
      trim: true,
      maxlength: 2000,
    },
    createdBy: {
      type: String,
      required: [true, "sender is required"],
      trim: true,
    },
    recipients: {
      type: Number,
      min: 0,
      default: 0,
    },
    // when set, notice is only for this auth user; omit for broadcast
    recipientUserId: {
      type: String,
      trim: true,
      default: null,
    },
    recipientName: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

const Notice = mongoose.models.notices || mongoose.model("notices", Notice_schema);

export { Notice, Notice_schema };
