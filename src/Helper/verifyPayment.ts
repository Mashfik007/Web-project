import { Order } from "@/Model/Orders";
import { Payment } from "@/Model/Payments";
import mongoose from "mongoose";

export type PaymentVerifyResult =
  | {
      ok: true;
      payment: InstanceType<typeof Payment>;
      order: InstanceType<typeof Order>;
    }
  | {
      ok: false;
      reason: string;
    };

const BD_PHONE = /^01[3-9]\d{8}$/;
const TXN_ID = /^[A-Za-z0-9]{6,20}$/;

export function isValidPaymentPhone(phone: string) {
  return BD_PHONE.test(phone);
}

export function isValidTransactionId(transactionId: string) {
  return TXN_ID.test(transactionId);
}

/** Validate a saved payment against its order without marking it verified. */
export async function validatePaymentRecord(
  paymentId: string | mongoose.Types.ObjectId,
): Promise<PaymentVerifyResult> {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    return { ok: false, reason: "Invalid payment id" };
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return { ok: false, reason: "Payment not found in database" };
  }

  if (payment.status === "rejected") {
    return { ok: false, reason: "Payment was rejected" };
  }

  const order = await Order.findById(payment.orderId);
  if (!order) {
    payment.status = "rejected";
    payment.verificationNote = "Order missing for payment";
    await payment.save();
    return { ok: false, reason: "Order not found for payment" };
  }

  if (String(payment.userId) !== String(order.userId)) {
    payment.status = "rejected";
    payment.verificationNote = "Payment user does not match order";
    await payment.save();
    order.paymentStatus = "rejected";
    await order.save();
    return { ok: false, reason: "Payment user does not match order" };
  }

  if (Number(payment.amount) !== Number(order.total)) {
    payment.status = "rejected";
    payment.verificationNote = "Payment amount does not match order total";
    await payment.save();
    order.paymentStatus = "rejected";
    await order.save();
    return { ok: false, reason: "Payment amount does not match order total" };
  }

  if (!isValidTransactionId(String(payment.transactionId))) {
    payment.status = "rejected";
    payment.verificationNote = "Invalid transaction ID format";
    await payment.save();
    order.paymentStatus = "rejected";
    await order.save();
    return { ok: false, reason: "Invalid transaction ID format" };
  }

  if (!isValidPaymentPhone(String(payment.paymentPhone))) {
    payment.status = "rejected";
    payment.verificationNote = "Invalid payment phone number";
    await payment.save();
    order.paymentStatus = "rejected";
    await order.save();
    return { ok: false, reason: "Invalid payment phone number" };
  }

  const duplicate = await Payment.findOne({
    transactionId: payment.transactionId,
    _id: { $ne: payment._id },
  }).select("_id");

  if (duplicate) {
    payment.status = "rejected";
    payment.verificationNote = "Duplicate transaction ID";
    await payment.save();
    order.paymentStatus = "rejected";
    await order.save();
    return { ok: false, reason: "Transaction ID already used" };
  }

  return { ok: true, payment, order };
}

/** Mark payment verified in the database after validation. */
export async function markPaymentVerifiedViaEmail(
  paymentId: string | mongoose.Types.ObjectId,
  note?: string,
): Promise<PaymentVerifyResult> {
  const validated = await validatePaymentRecord(paymentId);
  if (!validated.ok) return validated;

  const { payment, order } = validated;
  if (payment.status === "verified") {
    return { ok: true, payment, order };
  }

  payment.status = "verified";
  payment.verifiedAt = new Date();
  payment.verificationNote = note || "Verified in database";
  await payment.save();

  order.paymentStatus = "verified";
  order.paymentVerifiedAt = payment.verifiedAt;
  await order.save();

  return { ok: true, payment, order };
}

/** Re-check a saved payment against its order. */
export async function verifyPaymentInDatabase(
  paymentId: string | mongoose.Types.ObjectId,
): Promise<PaymentVerifyResult> {
  return validatePaymentRecord(paymentId);
}
