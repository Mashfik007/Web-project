import mongoose from "mongoose";

const Reservation_schema = new mongoose.Schema(
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
    reservedDate: {
      type: String,
      required: [true, "reserved date is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Ready", "Waiting", "Expired"],
      default: "Waiting",
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

const Reservation =
  mongoose.models.reservations ||
  mongoose.model("reservations", Reservation_schema);

export { Reservation, Reservation_schema };
