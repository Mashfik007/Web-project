import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import {
  markPaymentVerifiedViaEmail,
  validatePaymentRecord,
} from "@/Helper/verifyPayment";
import { Payment } from "@/Model/Payments";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify(new ApiError(status, message)), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Re-validate and mark payment verified in the database (no email). */
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

    const result = await markPaymentVerifiedViaEmail(payment._id);
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
          },
          "Payment verified in database.",
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
