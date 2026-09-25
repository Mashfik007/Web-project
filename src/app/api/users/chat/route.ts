import connectDB from "@/dbConfig/dbConfig";
import { COMMUNITY_CHAT_ID, peerFromDirectChat } from "@/Helper/chat";
import { requireUserId } from "@/Helper/userFromToken";
import { Message } from "@/Model/Messages";
import { User } from "@/Model/Users";
import { SendMessage_schema } from "@/Shchema/chat";
import type { ChatMessage } from "@/types/chat";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

const colors = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function initials(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "R";
}

function colorFor(name: string) {
  const code = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return colors[code % colors.length];
}

async function allowedConversation(userId: string, conversationId: string) {
  if (conversationId === COMMUNITY_CHAT_ID) return true;
  const peerId = peerFromDirectChat(conversationId, userId);
  if (!peerId || !mongoose.Types.ObjectId.isValid(peerId)) return false;
  const peer = await User.findById(peerId).select("isAdmin").lean<{ isAdmin?: boolean } | null>();
  return Boolean(peer && !peer.isAdmin);
}

async function toMessages(
  rows: { _id: { toString(): string }; senderId: string; body: string; createdAt?: Date }[],
): Promise<ChatMessage[]> {
  const senderIds = [...new Set(rows.map((row) => row.senderId))].filter((id) =>
    mongoose.Types.ObjectId.isValid(id),
  );
  const senders = await User.find({ _id: { $in: senderIds } })
    .select("name")
    .lean<{ _id: { toString(): string }; name?: string }[]>();
  const names = new Map(
    senders.map((sender) => [sender._id.toString(), sender.name?.trim() || "Reader"]),
  );

  return rows.map((row) => {
    const senderName = names.get(row.senderId) || "Reader";
    return {
      id: row._id.toString(),
      senderId: row.senderId,
      senderName,
      initials: initials(senderName),
      avatarColor: colorFor(senderName),
      body: row.body,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
    };
  });
}

export async function GET(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;

    const conversationId = new URL(request.url).searchParams.get("conversationId")?.trim() ?? "";
    if (!conversationId) {
      return new Response(JSON.stringify(new ApiError(400, "conversation is required")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    if (!(await allowedConversation(session, conversationId))) {
      return new Response(JSON.stringify(new ApiError(404, "Conversation not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rows = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean<{ _id: { toString(): string }; senderId: string; body: string; createdAt?: Date }[]>();
    rows.reverse();

    const messages = await toMessages(rows);
    return new Response(JSON.stringify(new ApiResponce(200, messages, "Messages")), {
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

export async function POST(request: Request) {
  try {
    const parsed = SendMessage_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid message")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;

    await connectDB();
    if (!(await allowedConversation(session, parsed.data.conversationId))) {
      return new Response(JSON.stringify(new ApiError(404, "Conversation not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const saved = await Message.create({
      conversationId: parsed.data.conversationId,
      senderId: session,
      body: parsed.data.body,
    });

    const [message] = await toMessages([
      {
        _id: saved._id,
        senderId: saved.senderId,
        body: saved.body,
        createdAt: saved.createdAt,
      },
    ]);

    return new Response(JSON.stringify(new ApiResponce(201, message, "Message sent")), {
      status: 201,
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
