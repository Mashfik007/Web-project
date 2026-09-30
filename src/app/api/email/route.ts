import { type FolioEmailType } from "@/Components/Email/email-template";
import { sendFolioEmail } from "@/Helper/sendFolioEmail";

const emailTypes = new Set<FolioEmailType>([
  "welcome",
  "account_suspended",
  "borrow_cancelled",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const typeValue = String(body.type ?? "welcome");
    const type = emailTypes.has(typeValue as FolioEmailType)
      ? (typeValue as FolioEmailType)
      : "welcome";

    const result = await sendFolioEmail({
      email: String(body.email ?? ""),
      name: String(body.name ?? "there"),
      type,
      bookTitle: body.bookTitle ? String(body.bookTitle) : undefined,
      reason: body.reason ? String(body.reason) : undefined,
    });

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({ id: result.id });
  } catch (error) {
    console.error("[api/email] Unexpected error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 },
    );
  }
}
