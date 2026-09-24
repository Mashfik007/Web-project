import mongoose from "mongoose";

const ShelfLoan_schema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["reading", "wishlist", "returned"],
      default: "reading",
    },
    currentPage: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    renewedCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    blindDate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

ShelfLoan_schema.index({ userId: 1, bookId: 1 }, { unique: true });

const existingShelfLoan = mongoose.models.shelfLoans;
if (existingShelfLoan && !existingShelfLoan.schema.path("blindDate")) {
  existingShelfLoan.schema.add({
    blindDate: { type: Boolean, default: false },
  });
}

const ShelfLoan =
  existingShelfLoan || mongoose.model("shelfLoans", ShelfLoan_schema);

export { ShelfLoan, ShelfLoan_schema };
