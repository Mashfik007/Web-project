import {
  EmailTemplate,
  type FolioEmailType,
  type PaymentEmailDetails,
} from "@/Components/Email/email-template";
import { render } from "@react-email/render";
import { Resend } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const subjects: Record<FolioEmailType, string> = {
  welcome: "Welcome to Folio",
  account_suspended: "Your Folio account was deactivated",
  borrow_cancelled: "Your Folio book request was cancelled",
  payment_verification: "Folio payment verification — Transaction ID",
};

function getResendApiKey() {
  const key = String(process.env.RESEND_API_KEY ?? "").trim();
  if (!key) return { ok: false as const, error: "RESEND_API_KEY is missing" };
  if (!key.startsWith("re_")) {
    return {
      ok: false as const,
      error:
        "RESEND_API_KEY is invalid. Set a key from https://resend.com/api-keys (starts with re_)",
    };
  }
  return { ok: true as const, key };
}

/** With onboarding@resend.dev, payment emails must go to the Resend account email. */
function resolveRecipient(type: FolioEmailType, requestedEmail: string) {
  const verifiedTo = String(process.env.RESEND_TO_EMAIL ?? "")
    .trim()
    .toLowerCase();

  if (type === "payment_verification") {
    if (!verifiedTo || !emailPattern.test(verifiedTo)) {
      return {
        ok: false as const,
        error:
          "RESEND_TO_EMAIL is missing. Set it to your verified Resend account email.",
      };
    }
    return { ok: true as const, email: verifiedTo };
  }

  return { ok: true as const, email: requestedEmail };
}

export async function sendFolioEmail(input: {
  email: string;
  name: string;
  type?: FolioEmailType;
  bookTitle?: string;
  reason?: string;
} & PaymentEmailDetails) {
  const requestedEmail = String(input.email ?? "").trim().toLowerCase();
  const name = String(input.name ?? "there").trim() || "there";
  const type = input.type ?? "welcome";
  const bookTitle = String(input.bookTitle ?? "").trim();
  const reason = String(input.reason ?? "").trim();
  const transactionId = String(input.transactionId ?? "").trim().toUpperCase();
  const orderNumber = String(input.orderNumber ?? "").trim();
  const amount = String(input.amount ?? "").trim();
  const paymentMethod = String(input.paymentMethod ?? "").trim();
  const paymentPhone = String(input.paymentPhone ?? "").trim();
  const buyerName = String(input.buyerName ?? name).trim();
  const buyerEmail = String(input.buyerEmail ?? requestedEmail).trim().toLowerCase();

  const recipient = resolveRecipient(type, requestedEmail);
  if (!recipient.ok) return recipient;
  const email = recipient.email;

  const firstName =
    type === "payment_verification"
      ? "Admin"
      : name.split(/\s+/)[0] || "there";

  if (!emailPattern.test(email)) {
    return { ok: false as const, error: "Valid recipient email is required" };
  }

  if (type === "payment_verification" && !transactionId) {
    return {
      ok: false as const,
      error: "Transaction ID is required for payment verification email",
    };
  }

  const apiKey = getResendApiKey();
  if (!apiKey.ok) return apiKey;

  const html = await render(
    EmailTemplate({
      firstName,
      type,
      bookTitle: bookTitle || undefined,
      reason: reason || undefined,
      transactionId: transactionId || undefined,
      orderNumber: orderNumber || undefined,
      amount: amount || undefined,
      paymentMethod: paymentMethod || undefined,
      paymentPhone: paymentPhone || undefined,
      buyerName: buyerName || undefined,
      buyerEmail: buyerEmail || undefined,
    }),
  );

  const textLines =
    type === "account_suspended"
      ? [
          `Hi ${firstName}, your Folio account was deactivated.`,
          "You will not be able to borrow or reserve books until it is reactivated.",
        ]
      : type === "borrow_cancelled"
        ? [
            `Hi ${firstName}, your book request was cancelled.`,
            bookTitle ? `Book: ${bookTitle}` : "",
            reason ? `Reason: ${reason}` : "",
          ].filter(Boolean)
        : type === "payment_verification"
          ? [
              `Hi ${firstName}, Folio payment verification.`,
              bookTitle ? `Book: ${bookTitle}` : "",
              orderNumber ? `Order: ${orderNumber}` : "",
              `Transaction ID: ${transactionId}`,
              amount ? `Amount: ${amount}` : "",
              paymentMethod ? `Method: ${paymentMethod}` : "",
              paymentPhone ? `Paid from: ${paymentPhone}` : "",
              buyerName ? `Buyer: ${buyerName}` : "",
              buyerEmail ? `Buyer email: ${buyerEmail}` : "",
              "Confirm this Transaction ID in bKash/Rocket, then process the order.",
            ].filter(Boolean)
          : [
              `Welcome, ${firstName}!`,
              "Your Folio account is ready. Sign in anytime and start building your shelf.",
            ];

  const from =
    String(process.env.RESEND_FROM_EMAIL ?? "").trim() ||
    "Folio <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey.key);
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject:
        type === "payment_verification"
          ? `Folio payment verification — ${transactionId}`
          : subjects[type],
      html,
      text: textLines.join("\n"),
    });

    if (error) {
      console.error("[email] Resend failed:", error);
      return {
        ok: false as const,
        error: error.message || "Resend could not send the email",
      };
    }

    if (!data?.id) {
      return {
        ok: false as const,
        error: "Resend did not return an email id",
      };
    }

    console.info("[email] Sent", {
      type,
      to: email,
      id: data.id,
      transactionId: transactionId || undefined,
    });

    return { ok: true as const, id: data.id, to: email };
  } catch (error) {
    console.error("[email] Resend threw:", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
