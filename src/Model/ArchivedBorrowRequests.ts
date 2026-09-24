import mongoose from "mongoose";

const ArchivedBorrowRequest_schema = new mongoose.Schema(
  {
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    request: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const ArchivedBorrowRequest =
  mongoose.models.archivedBorrowRequests ||
  mongoose.model("archivedBorrowRequests", ArchivedBorrowRequest_schema);

export { ArchivedBorrowRequest, ArchivedBorrowRequest_schema };
