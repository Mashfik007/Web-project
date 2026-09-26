import connectDB from "@/dbConfig/dbConfig";
import { getUnreadChatCount } from "@/data/getUnreadChatCount";
import { userCanAccessConversation } from "@/Helper/chatAccess";
import { requireUserId } from "@/Helper/userFromToken";
import { ChatRead } from "@/Model/ChatReads";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;

    const body = await request.json().catch(() => null);
    const conversationId =
      body && typeof body === "object" && "conversationId" in body
        ? String(body.conversationId ?? "").trim()
        : "";
    if (!conversationId) {
      return new Response(JSON.stringify(new ApiError(400, "conversation is required")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    if (!(await userCanAccessConversation(session, conversationId))) {
      return new Response(JSON.stringify(new ApiError(404, "Conversation not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ChatRead.findOneAndUpdate(
      { userId: session, conversationId },
      { lastReadAt: new Date() },
      { upsert: true },
    );

    const unread = await getUnreadChatCount(session);
    return new Response(JSON.stringify(new ApiResponce(200, { unread }, "Marked read")), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
