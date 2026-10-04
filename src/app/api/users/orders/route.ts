import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import {
  isValidPaymentPhone,
  isValidTransactionId,
} from "@/Helper/verifyPayment";
import { publishOrderUpdate } from "@/Helper/publishDomain";
import { Book } from "@/Model/Books";
import { Order } from "@/Model/Orders";
import { Payment } from "@/Model/Payments";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MERCHANT_NUMBER = "01921591087";
const ALLOWED_METHODS = new Set(["bkash", "rocket"]);

function orderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FLO-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = String(session);

    const body = await request.json();
    const bookId = String(body.bookId ?? "").trim();
    const quantity = Number(body.quantity);
    const fullName = String(body.fullName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const city = String(body.city ?? "").trim();
    const methodId = String(body.methodId ?? body.paymentMethod ?? "")
      .trim()
      .toLowerCase();
    const paymentMethodName = String(body.paymentMethodName ?? "").trim();
    const transactionId = String(body.transactionId ?? "")
      .trim()
      .toUpperCase();
    const paymentPhone = String(body.paymentPhone ?? "").trim();

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json(new ApiError(400, "Choose a valid book"), {
        status: 400,
      });
    }

    if (!fullName || !phone || !address || !city) {
      return NextResponse.json(
        new ApiError(400, "Delivery details are required"),
        { status: 400 },
      );
    }

    if (!ALLOWED_METHODS.has(methodId)) {
      return NextResponse.json(
        new ApiError(400, "Select a valid payment method"),
        { status: 400 },
      );
    }

    if (!isValidTransactionId(transactionId)) {
      return NextResponse.json(
        new ApiError(400, "Enter a valid transaction ID"),
        { status: 400 },
      );
    }

    if (!isValidPaymentPhone(paymentPhone)) {
      return NextResponse.json(
        new ApiError(400, "Enter a valid payment phone number"),
        { status: 400 },
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(new ApiError(400, "Choose a valid quantity"), {
        status: 400,
      });
    }

    await connectDB();

    const existingOrder = await Order.findOne({ transactionId }).select("_id");
    if (existingOrder) {
      return NextResponse.json(
        new ApiError(
          409,
          "This transaction ID was already used. Enter a new TxnID.",
        ),
        { status: 409 },
      );
    }

    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      const linkedOrder = await Order.findById(existingPayment.orderId).select(
        "_id",
      );
      if (linkedOrder) {
        return NextResponse.json(
          new ApiError(
            409,
            "This transaction ID was already used. Enter a new TxnID.",
          ),
          { status: 409 },
        );
      }
      await Payment.findByIdAndDelete(existingPayment._id);
    }

    const book = await Book.findById(bookId).select(
      "title author coverImage price",
    );
    if (!book) {
      return NextResponse.json(new ApiError(404, "Book not found"), {
        status: 404,
      });
    }

    const unitPrice = Number(book.price?.amount ?? 0);
    const deliveryFee = 60;
    const total = unitPrice * quantity + deliveryFee;
    const currency = book.price?.currency ?? "৳";
    const paymentMethod =
      paymentMethodName || (methodId === "bkash" ? "bKash" : "Rocket");
    const createdOrderNumber = orderNumber();
    const now = new Date();

    const order = await Order.create({
      userId,
      bookId,
      orderNumber: createdOrderNumber,
      bookTitle: book.title,
      author: book.author || "Unknown",
      coverImage: book.coverImage
        ? `/api/uploads/${book.coverImage}`
        : "/svg/book.svg",
      quantity,
      unitPrice,
      deliveryFee,
      currency,
      total,
      fullName,
      phone,
      address,
      city,
      paymentMethod,
      methodId,
      transactionId,
      paymentPhone,
      paymentStatus: "verified",
      paymentVerifiedAt: now,
      status: "processing",
    });

    let payment;
    try {
      payment = await Payment.create({
        userId,
        orderId: order._id,
        orderNumber: createdOrderNumber,
        paymentMethod,
        methodId,
        transactionId,
        paymentPhone,
        amount: total,
        currency,
        merchantNumber: MERCHANT_NUMBER,
        status: "verified",
        verifiedAt: now,
        verificationNote: "Verified in database",
      });
    } catch (error: any) {
      await Order.findByIdAndDelete(order._id);
      if (error?.code === 11000) {
        return NextResponse.json(
          new ApiError(409, "This transaction ID was already used"),
          { status: 409 },
        );
      }
      throw error;
    }

    order.paymentId = payment._id;
    await order.save();

    await publishOrderUpdate({
      action: "placed",
      id: String(order._id),
      userId,
      bookId: String(order.bookId || ""),
    });

    console.info("[orders] Saved", {
      orderId: String(order._id),
      orderNumber: createdOrderNumber,
      userId,
      transactionId,
    });

    return NextResponse.json(
      new ApiResponce(
        201,
        {
          ...order.toObject(),
          payment: payment.toObject(),
        },
        "Order saved successfully",
      ),
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[orders] Failed:", error);
    return NextResponse.json(
      new ApiError(500, error.message || "Internal Server Error"),
      { status: 500 },
    );
  }
}
