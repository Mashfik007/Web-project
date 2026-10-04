import mongoose from "mongoose";

const Order_schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    bookId: {
      type: String,
      required: true,
      trim: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bookTitle: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    coverImage: { type: String, default: "/svg/book.svg" },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "৳" },
    total: { type: Number, required: true, min: 0 },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, trim: true },
    methodId: {
      type: String,
      enum: ["bkash", "rocket"],
      default: null,
    },
    transactionId: { type: String, required: true, trim: true, uppercase: true },
    paymentPhone: { type: String, default: "", trim: true },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payments",
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    paymentVerifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["processing", "in-transit", "delivered"],
      default: "processing",
    },
  },
  { timestamps: true },
);

Order_schema.index({ transactionId: 1 }, { unique: true });

const Order = mongoose.models.orders || mongoose.model("orders", Order_schema);

export { Order, Order_schema };
