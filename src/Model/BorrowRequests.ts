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
    userId: {
      type: String,
      trim: true,
    },
    bookId: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: String,
      trim: true,
      default: "",
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    decidedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const existingBorrowRequest = mongoose.models.borrowRequests;
if (existingBorrowRequest && !existingBorrowRequest.schema.path("reason")) {
  existingBorrowRequest.schema.add({
    reason: { type: String, trim: true, default: "" },
    decidedAt: { type: Date, default: null },
  });
}
if (existingBorrowRequest && !existingBorrowRequest.schema.path("ownerId")) {
  existingBorrowRequest.schema.add({
    ownerId: { type: String, trim: true, default: "" },
  });
}

const BorrowRequest =
  existingBorrowRequest ||
  mongoose.model("borrowRequests", BorrowRequest_schema);

export { BorrowRequest, BorrowRequest_schema };
