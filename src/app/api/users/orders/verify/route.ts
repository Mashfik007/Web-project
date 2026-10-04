import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { sendFolioEmail } from "@/Helper/sendFolioEmail";
import {
  markPaymentVerifiedViaEmail,
  validatePaymentRecord,
} from "@/Helper/verifyPayment";
import { Payment } from "@/Model/Payments";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify(new ApiError(status, message)), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Re-send the Transaction ID verification email and mark payment verified when sent. */
export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;

    const body = await request.json();
    const paymentId = String(body.paymentId ?? "").trim();
    const transactionId = String(body.transactionId ?? "")
      .trim()
      .toUpperCase();
    const orderId = String(body.orderId ?? "").trim();

    if (!paymentId && !transactionId && !orderId) {
      return jsonError(400, "Provide paymentId, transactionId, or orderId");
    }

    await connectDB();

    let payment = null;
    if (paymentId && mongoose.Types.ObjectId.isValid(paymentId)) {
      payment = await Payment.findById(paymentId);
    } else if (transactionId) {
      payment = await Payment.findOne({ transactionId });
    } else if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      payment = await Payment.findOne({ orderId });
    }

    if (!payment) {
      return jsonError(404, "Payment not found in database");
    }

    if (String(payment.userId) !== String(userId)) {
      return jsonError(403, "You can only verify your own payments");
    }

    const validated = await validatePaymentRecord(payment._id);
    if (!validated.ok) {
      return jsonError(400, validated.reason);
    }

    const account = await User.findById(userId).select("name email");
    if (!account?.email) {
      return jsonError(400, "Add an email to your account to verify payment");
    }

    const emailResult = await sendFolioEmail({
      email: account.email,
      name: account.name || "Member",
      type: "payment_verification",
      bookTitle: validated.order.bookTitle,
      transactionId: String(payment.transactionId),
      orderNumber: String(payment.orderNumber),
      amount: `${payment.currency}${payment.amount}`,
      paymentMethod: String(payment.paymentMethod),
      paymentPhone: String(payment.paymentPhone),
      buyerName: account.name || "Member",
      buyerEmail: account.email,
    });

    if (!emailResult.ok) {
      return jsonError(
        500,
        emailResult.error || "Could not send verification email",
      );
    }

    const result = await markPaymentVerifiedViaEmail(payment._id, emailResult.id);
    if (!result.ok) {
      return jsonError(400, result.reason);
    }

    return new Response(
      JSON.stringify(
        new ApiResponce(
          200,
          {
            payment: result.payment,
            order: result.order,
            paymentStatus: result.payment.status,
            verifiedAt: result.payment.verifiedAt,
            emailSent: true,
            verificationEmail: emailResult.to || account.email,
          },
          "Transaction ID sent to your email. Payment verified.",
        ),
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
