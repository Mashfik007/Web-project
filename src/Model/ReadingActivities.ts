import mongoose from "mongoose";

const ReadingActivity_schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user is required"],
      trim: true,
    },
    bookId: {
      type: String,
      required: [true, "book is required"],
      trim: true,
    },
    loanId: {
      type: String,
      required: [true, "loan is required"],
      trim: true,
    },
    hours: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 1,
    },
    page: {
      type: Number,
      required: true,
      min: 0,
    },
    loggedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const ReadingActivity =
  mongoose.models.readingActivities ||
  mongoose.model("readingActivities", ReadingActivity_schema);

export { ReadingActivity, ReadingActivity_schema };
