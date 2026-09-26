import connectDB from "@/dbConfig/dbConfig";
import { publishNotice } from "@/Helper/publishNotice";
import { requireAdmin } from "@/Helper/requireAdmin";
import { Notice } from "@/Model/Notices";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    const body = await request.json().catch(() => null);
    const title =
      body && typeof body === "object" && "title" in body
        ? String(body.title ?? "").trim()
        : "";
    const message =
      body && typeof body === "object" && "message" in body
        ? String(body.message ?? "").trim()
        : "";

    if (!title || !message) {
      return new Response(
        JSON.stringify(new ApiError(400, "Title and message are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (title.length > 120 || message.length > 2000) {
      return new Response(
        JSON.stringify(new ApiError(400, "Title or message is too long")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await connectDB();
    const recipients = await User.countDocuments({ isAdmin: { $ne: true } });
    const saved = await Notice.create({
      title,
      message,
      createdBy: admin._id,
      recipients,
    });

    await publishNotice({
      id: saved._id.toString(),
      title: saved.title,
      message: saved.message,
      createdAt: new Date(saved.createdAt).toISOString(),
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          null,
          recipients === 1
            ? "Notification sent to 1 reader"
            : `Notification sent to ${recipients} readers`,
        ),
      ),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const text = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify(new ApiError(500, text)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
