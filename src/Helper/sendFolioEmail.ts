import {
  EmailTemplate,
  type FolioEmailType,
} from "@/Components/Email/email-template";
import { render } from "@react-email/render";
import { Resend } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const subjects: Record<FolioEmailType, string> = {
  welcome: "Welcome to Folio",
  account_suspended: "Your Folio account was deactivated",
  borrow_cancelled: "Your Folio book request was cancelled",
};

export async function sendFolioEmail(input: {
  email: string;
  name: string;
  type?: FolioEmailType;
  bookTitle?: string;
  reason?: string;
}) {
  const email = String(input.email ?? "").trim().toLowerCase();
  const name = String(input.name ?? "there").trim() || "there";
  const firstName = name.split(/\s+/)[0] || "there";
  const type = input.type ?? "welcome";
  const bookTitle = String(input.bookTitle ?? "").trim();
  const reason = String(input.reason ?? "").trim();

  if (!emailPattern.test(email)) {
    return { ok: false as const, error: "Valid recipient email is required" };
  }

  if (!process.env.RESEND_API_KEY) {
    return { ok: false as const, error: "RESEND_API_KEY is missing" };
  }

  const html = await render(
    EmailTemplate({
      firstName,
      type,
      bookTitle: bookTitle || undefined,
      reason: reason || undefined,
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
        : [
            `Welcome, ${firstName}!`,
            "Your Folio account is ready. Sign in anytime and start building your shelf.",
          ];

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: "Folio <onboarding@resend.dev>",
    to: [email],
    subject: subjects[type],
    html,
    text: textLines.join("\n"),
  });

  if (error) {
    console.error("[email] Resend failed:", error);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, id: data?.id };
}
