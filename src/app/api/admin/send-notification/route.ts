import connectDB from "@/dbConfig/dbConfig";
import { publishNotice } from "@/Helper/publishNotice";
import { requireAdmin } from "@/Helper/requireAdmin";
import { Notice } from "@/Model/Notices";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;

    await connectDB();
    const { title, message, userId } = await request.json();
    const noticeTitle = String(title ?? "").trim();
    const noticeMessage = String(message ?? "").trim();
    const targetUserId =
      typeof userId === "string" && userId.trim() ? userId.trim() : "";

    if (!noticeTitle || !noticeMessage) {
      return new Response(
        JSON.stringify(new ApiError(400, "Title and message are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (noticeTitle.length > 120 || noticeMessage.length > 2000) {
      return new Response(
        JSON.stringify(new ApiError(400, "Title or message is too long")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    let recipients = 0;
    let recipientUserId: string | null = null;
    let recipientName: string | null = null;

    if (targetUserId) {
      if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        return new Response(
          JSON.stringify(new ApiError(400, "Invalid reader selected")),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const target = await User.findById(targetUserId)
        .select("name email isAdmin")
        .lean<{ name?: string; email?: string; isAdmin?: boolean } | null>();

      if (!target || target.isAdmin) {
        return new Response(
          JSON.stringify(new ApiError(404, "Reader not found")),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      recipients = 1;
      recipientUserId = targetUserId;
      recipientName = target.name?.trim() || target.email || "Reader";
    } else {
      recipients = await User.countDocuments({ isAdmin: { $ne: true } });
    }

    const saved = await Notice.create({
      title: noticeTitle,
      message: noticeMessage,
      createdBy: admin._id,
      recipients,
      recipientUserId,
      recipientName,
    });

    await publishNotice(
      {
        id: saved._id.toString(),
        title: saved.title,
        message: saved.message,
        createdAt: new Date(saved.createdAt).toISOString(),
      },
      recipientUserId,
    );

    const sentMsg = recipientUserId
      ? `Notification sent to ${recipientName}`
      : recipients === 1
        ? "Notification sent to 1 reader"
        : `Notification sent to ${recipients} readers`;

    return new Response(
      JSON.stringify(new ApiResponce(201, null, sentMsg)),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        new ApiError(500, error.message || "Internal Server Error"),
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
