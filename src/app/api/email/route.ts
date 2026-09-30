import { EmailTemplate } from "@/Components/Email/email-template";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const email = String(body.email ?? "").trim().toLowerCase();
        const name = String(body.name ?? "there").trim() || "there";
        const firstName = name.split(/\s+/)[0] || "there";

        if (!emailPattern.test(email)) {
            return Response.json({ error: "Valid recipient email is required" }, { status: 400 });
        }

        if (!process.env.RESEND_API_KEY) {
            return Response.json({ error: "RESEND_API_KEY is missing" }, { status: 500 });
        }

        const html = await render(EmailTemplate({ firstName }));
        const text = [
            `Welcome, ${firstName}!`,
            "",
            "Discover, borrow, and connect with a community of passionate readers.",
            "Your Folio account is ready. Sign in anytime and start building your shelf.",
        ].join("\n");

        const { data, error } = await resend.emails.send({
            from: "Folio <onboarding@resend.dev>",
            to: [email],
            subject: "Welcome to Folio",
            html,
            text,
        });

        if (error) {
            console.error("[api/email] Resend failed:", error);
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        console.error("[api/email] Unexpected error:", error);
        return Response.json(
            { error: error instanceof Error ? error.message : "Failed to send email" },
            { status: 500 },
        );
    }
}
