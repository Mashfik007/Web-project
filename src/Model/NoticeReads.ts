import mongoose from "mongoose";

const NoticeRead_schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user is required"],
      trim: true,
      unique: true,
    },
    lastReadAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const NoticeRead =
  mongoose.models.noticereads || mongoose.model("noticereads", NoticeRead_schema);

export { NoticeRead, NoticeRead_schema };
