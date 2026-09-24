import mongoose from "mongoose";

const BorrowRequest_schema = new mongoose.Schema(
  {
    member: {
      type: String,
      required: [true, "member is required"],
      trim: true,
    },
    book: {
      type: String,
      required: [true, "book is required"],
      trim: true,
    },
    requested: {
      type: String,
      required: [true, "requested date is required"],
      trim: true,
    },
    expectedReturn: {
      type: String,
      required: [true, "expected return is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const BorrowRequest =
  mongoose.models.borrowRequests ||
  mongoose.model("borrowRequests", BorrowRequest_schema);

export { BorrowRequest, BorrowRequest_schema };
