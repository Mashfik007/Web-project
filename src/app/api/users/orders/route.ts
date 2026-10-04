import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { sendFolioEmail } from "@/Helper/sendFolioEmail";
import {
  isValidPaymentPhone,
  isValidTransactionId,
  markPaymentVerifiedViaEmail,
  validatePaymentRecord,
} from "@/Helper/verifyPayment";
import { Book } from "@/Model/Books";
import { Order } from "@/Model/Orders";
import { Payment } from "@/Model/Payments";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishOrderUpdate } from "@/Helper/publishDomain";

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

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify(new ApiError(status, message)), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
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
      return jsonError(400, "Choose a valid book");
    }

    if (!fullName || !phone || !address || !city) {
      return jsonError(400, "Delivery details are required");
    }

    if (!ALLOWED_METHODS.has(methodId)) {
      return jsonError(400, "Select a valid payment method");
    }

    if (!isValidTransactionId(transactionId)) {
      return jsonError(400, "Enter a valid transaction ID");
    }

    if (!isValidPaymentPhone(paymentPhone)) {
      return jsonError(400, "Enter a valid payment phone number");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return jsonError(400, "Choose a valid quantity");
    }

    await connectDB();

    const account = await User.findById(userId).select("name email");
    if (!account?.email) {
      return jsonError(400, "Add an email to your account to verify payment");
    }

    const existingPayment = await Payment.findOne({ transactionId }).select("_id");
    if (existingPayment) {
      return jsonError(409, "This transaction ID was already used");
    }

    const existingOrder = await Order.findOne({ transactionId }).select("_id");
    if (existingOrder) {
      return jsonError(409, "This transaction ID was already used");
    }

    const book = await Book.findById(bookId).select("title author coverImage price");
    if (!book) {
      return jsonError(404, "Book not found");
    }

    const unitPrice = book.price?.amount ?? 0;
    const deliveryFee = 60;
    const total = unitPrice * quantity + deliveryFee;
    const currency = book.price?.currency ?? "৳";
    const paymentMethod =
      paymentMethodName || (methodId === "bkash" ? "bKash" : "Rocket");
    const createdOrderNumber = orderNumber();

    const order = await Order.create({
      userId,
      bookId,
      orderNumber: createdOrderNumber,
      bookTitle: book.title,
      author: book.author,
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
      paymentStatus: "pending",
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
        status: "pending",
      });
    } catch (error: any) {
      await Order.findByIdAndDelete(order._id);
      if (error?.code === 11000) {
        return jsonError(409, "This transaction ID was already used");
      }
      throw error;
    }

    order.paymentId = payment._id;
    await order.save();

    const validated = await validatePaymentRecord(payment._id);
    if (!validated.ok) {
      await Payment.findByIdAndDelete(payment._id);
      await Order.findByIdAndDelete(order._id);
      return jsonError(400, validated.reason || "Payment validation failed");
    }

    let emailResult;
    try {
      emailResult = await sendFolioEmail({
        email: account.email,
        name: account.name || fullName,
        type: "payment_verification",
        bookTitle: book.title,
        transactionId,
        orderNumber: createdOrderNumber,
        amount: `${currency}${total}`,
        paymentMethod,
        paymentPhone,
        buyerName: account.name || fullName,
        buyerEmail: account.email,
      });
    } catch (error) {
      console.error("[orders] Payment verification email failed:", error);
      emailResult = {
        ok: false as const,
        error: error instanceof Error ? error.message : "Email failed",
      };
    }

    let verificationEmail = String(process.env.RESEND_TO_EMAIL ?? "").trim();
    let emailId: string | undefined;

    if (emailResult.ok) {
      verificationEmail = emailResult.to || verificationEmail;
      emailId = emailResult.id;
      await markPaymentVerifiedViaEmail(payment._id, emailResult.id);
    } else {
      console.error(
        "[orders] Payment verification email failed:",
        emailResult.error,
      );
    }

    const freshOrder = await Order.findById(order._id);
    const freshPayment = await Payment.findById(payment._id);

    await publishOrderUpdate({
      action: "placed",
      id: String(order._id),
      userId: String(userId),
      bookId: String(order.bookId || ""),
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          {
            ...(freshOrder?.toObject() ?? order.toObject()),
            payment: freshPayment?.toObject() ?? payment.toObject(),
            emailSent: emailResult.ok,
            verificationEmail,
            emailId,
            emailError: emailResult.ok ? undefined : emailResult.error,
          },
          emailResult.ok
            ? "Order placed. Transaction ID sent for email verification."
            : `Order saved, but verification email failed: ${emailResult.error}`,
        ),
      ),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
