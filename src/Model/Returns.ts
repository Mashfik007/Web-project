import mongoose from "mongoose";

const Return_schema = new mongoose.Schema(
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
    issueDate: {
      type: String,
      required: [true, "issue date is required"],
      trim: true,
    },
    dueDate: {
      type: String,
      required: [true, "due date is required"],
      trim: true,
    },
    returnDate: {
      type: String,
      default: null,
    },
    daysOverdue: {
      type: Number,
      min: 0,
      default: 0,
    },
    fine: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Returned", "Overdue", "Due Today", "Active"],
      default: "Active",
    },
    borrowRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

const ReturnRecord =
  mongoose.models.returns || mongoose.model("returns", Return_schema);

export { ReturnRecord, Return_schema };
