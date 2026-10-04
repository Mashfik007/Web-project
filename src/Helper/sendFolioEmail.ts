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

/** Free Resend (onboarding@resend.dev) can only deliver to RESEND_TO_EMAIL. */
function resolveRecipient(requestedEmail: string) {
  const from =
    String(process.env.RESEND_FROM_EMAIL ?? "").trim() ||
    "Folio <onboarding@resend.dev>";
  const testingFrom = from.toLowerCase().includes("onboarding@resend.dev");
  const verifiedTo = String(process.env.RESEND_TO_EMAIL ?? "")
    .trim()
    .toLowerCase();

  if (testingFrom) {
    if (!verifiedTo || !emailPattern.test(verifiedTo)) {
      return {
        ok: false as const,
        error:
          "RESEND_TO_EMAIL is required while using onboarding@resend.dev. Set it to your Resend account email.",
      };
    }
    return { ok: true as const, email: verifiedTo, from };
  }

  if (!emailPattern.test(requestedEmail)) {
    return { ok: false as const, error: "Valid recipient email is required" };
  }
  return { ok: true as const, email: requestedEmail, from };
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
  const buyerEmail = String(input.buyerEmail ?? requestedEmail)
    .trim()
    .toLowerCase();
  const firstName = name.split(/\s+/)[0] || "there";

  if (type === "payment_verification" && !transactionId) {
    return {
      ok: false as const,
      error: "Transaction ID is required for payment verification email",
    };
  }

  const recipient = resolveRecipient(requestedEmail);
  if (!recipient.ok) return recipient;

  const apiKey = getResendApiKey();
  if (!apiKey.ok) return apiKey;

  const subject =
    type === "payment_verification"
      ? `Folio Transaction ID: ${transactionId}`
      : subjects[type];

  // Purchase: plain text only. Welcome / other: HTML template like before.
  let html: string | undefined;
  let text: string;

  if (type === "payment_verification") {
    text = [
      `Transaction ID: ${transactionId}`,
      orderNumber ? `Order: ${orderNumber}` : "",
      bookTitle ? `Book: ${bookTitle}` : "",
      amount ? `Amount: ${amount}` : "",
      paymentMethod ? `Method: ${paymentMethod}` : "",
      paymentPhone ? `Paid from: ${paymentPhone}` : "",
      buyerName ? `Buyer: ${buyerName}` : "",
      buyerEmail ? `Buyer email: ${buyerEmail}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    html = await render(
      EmailTemplate({
        firstName,
        type,
        bookTitle: bookTitle || undefined,
        reason: reason || undefined,
      }),
    );
    text =
      type === "account_suspended"
        ? `Hi ${firstName}, your Folio account was deactivated.`
        : type === "borrow_cancelled"
          ? [
              `Hi ${firstName}, your book request was cancelled.`,
              bookTitle ? `Book: ${bookTitle}` : "",
              reason ? `Reason: ${reason}` : "",
            ]
              .filter(Boolean)
              .join("\n")
          : `Welcome, ${firstName}!\nYour Folio account is ready. Sign in anytime and start building your shelf.`;
  }

  try {
    const resend = new Resend(apiKey.key);
    const { data, error } = await resend.emails.send({
      from: recipient.from,
      to: [recipient.email],
      subject,
      ...(html ? { html, text } : { text }),
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
      to: recipient.email,
      id: data.id,
      transactionId: transactionId || undefined,
    });

    return { ok: true as const, id: data.id, to: recipient.email };
  } catch (error) {
    console.error("[email] Resend threw:", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
