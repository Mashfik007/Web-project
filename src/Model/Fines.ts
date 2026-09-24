import mongoose from "mongoose";

const Fine_schema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["Overdue", "Damage", "Lost"],
      required: [true, "type is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: [1, "amount must be greater than 0"],
    },
    date: {
      type: String,
      required: [true, "date is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Waived"],
      default: "Pending",
    },
    paidAt: {
      type: String,
      default: null,
    },
    returnId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

const Fine = mongoose.models.fines || mongoose.model("fines", Fine_schema);

export { Fine, Fine_schema };
