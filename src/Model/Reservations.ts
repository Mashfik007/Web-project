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
    userId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    bookId: {
      type: String,
      default: "",
      trim: true,
      index: true,
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

const existingReservation = mongoose.models.reservations;
if (existingReservation) {
  if (!existingReservation.schema.path("userId")) {
    existingReservation.schema.add({
      userId: { type: String, default: "", trim: true, index: true },
    });
  }
  if (!existingReservation.schema.path("bookId")) {
    existingReservation.schema.add({
      bookId: { type: String, default: "", trim: true, index: true },
    });
  }
}

const Reservation =
  existingReservation || mongoose.model("reservations", Reservation_schema);

export { Reservation, Reservation_schema };
