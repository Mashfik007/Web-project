import { createServer } from "http";
import { COMMUNITY_CHAT_ID } from "@/Helper/chat";
import { CommunityGroup } from "@/Model/CommunityGroups";
import { GroupMember } from "@/Model/GroupMembers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";

const colors = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

type MessageRow = {
  _id: { toString(): string };
  senderId: string;
  body: string;
  createdAt?: Date;
};

function readCookie(header: string | undefined, name: string) {
  if (!header) return "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

function canJoin(userId: string, conversationId: string) {
  if (conversationId === COMMUNITY_CHAT_ID) return true;
  if (conversationId.startsWith("group:")) {
    return /^[a-f\d]{24}$/i.test(conversationId.slice("group:".length));
  }
  if (!conversationId.startsWith("dm:")) return false;
  const [left, right] = conversationId.slice(3).split(":");
  if (!left || !right || left === right) return false;
  return left === userId || right === userId;
}

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

function peerIdFrom(conversationId: string, userId: string) {
  const [left, right] = conversationId.slice(3).split(":");
  return left === userId ? right : left;
}

async function presentMessages(rows: MessageRow[]) {
  const users = mongoose.connection.collection("users");
  const senderIds = [...new Set(rows.map((row) => String(row.senderId)))].filter((id) =>
    mongoose.Types.ObjectId.isValid(id),
  );
  const senders = await users
    .find({ _id: { $in: senderIds.map((id) => new mongoose.Types.ObjectId(id)) } })
    .project({ name: 1 })
    .toArray();
  const names = new Map(
    senders.map((sender) => [
      String(sender._id),
      String(sender.name || "Reader").trim() || "Reader",
    ]),
  );

  return rows.map((row) => {
    const senderName = names.get(String(row.senderId)) || "Reader";
    return {
      id: String(row._id),
      senderId: String(row.senderId),
      senderName,
      initials: initials(senderName),
      avatarColor: colorFor(senderName),
      body: row.body,
      createdAt: new Date(row.createdAt || Date.now()).toISOString(),
    };
  });
}

async function joinUserRooms(socket: { join: (room: string | string[]) => Promise<void> | void }, userId: string) {
  const rooms = [COMMUNITY_CHAT_ID];
  const memberships = await GroupMember.find({ userId }).select("groupId").lean<{ groupId: string }[]>();
  for (const membership of memberships) {
    const groupId = String(membership.groupId || "");
    if (/^[a-f\d]{24}$/i.test(groupId)) rooms.push(`group:${groupId}`);
  }

  if (mongoose.Types.ObjectId.isValid(userId)) {
    const peers = await mongoose.connection
      .collection("users")
      .find({
        isAdmin: { $ne: true },
        _id: { $ne: new mongoose.Types.ObjectId(userId) },
      })
      .project({ _id: 1 })
      .toArray();
    for (const peer of peers) {
      const id = String(peer._id);
      const [left, right] = [userId, id].sort();
      rooms.push(`dm:${left}:${right}`);
    }
  }

  await socket.join(rooms);
}

async function assertConversation(userId: string, conversationId: string) {
  if (!canJoin(userId, conversationId)) {
    throw new Error("Conversation not found");
  }
  if (conversationId.startsWith("group:")) {
    const id = conversationId.slice("group:".length);
    const group = await CommunityGroup.findById(id).select("_id").lean();
    if (!group) throw new Error("Conversation not found");
    const member = await GroupMember.findOne({ groupId: id, userId }).select("_id").lean();
    if (!member) throw new Error("Join this group from the community page");
    return;
  }
  if (!conversationId.startsWith("dm:")) return;

  const peerId = peerIdFrom(conversationId, userId);
  if (!mongoose.Types.ObjectId.isValid(peerId)) {
    throw new Error("Conversation not found");
  }
  const peer = await mongoose.connection.collection("users").findOne(
    { _id: new mongoose.Types.ObjectId(peerId) },
    { projection: { isAdmin: 1 } },
  );
  if (!peer || peer.isAdmin) throw new Error("Conversation not found");
}

export async function startChatSocket() {
  const globalState = globalThis as typeof globalThis & {
    __chatHttp?: ReturnType<typeof createServer>;
    __chatIo?: Server;
  };
  if (globalState.__chatHttp) {
    await new Promise<void>((resolve) => {
      globalState.__chatIo?.close();
      globalState.__chatHttp?.close(() => resolve());
    });
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URL!);
  }

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  io.use((socket, nextSocket) => {
    try {
      const headerToken = socket.handshake.auth?.token;
      const token =
        typeof headerToken === "string" && headerToken
          ? headerToken
          : readCookie(socket.handshake.headers.cookie, "accessToken");
      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!);
      const userId = payload && typeof payload === "object" ? payload._id : null;
      if (!userId) {
        nextSocket(new Error("unauthorized"));
        return;
      }
      socket.data.userId = String(userId);
      nextSocket();
    } catch {
      nextSocket(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = String(socket.data.userId || "");
    void joinUserRooms(socket, userId);

    socket.on("rooms:sync", () => {
      void joinUserRooms(socket, userId);
    });

    socket.on("conversation:join", (conversationId: unknown) => {
      if (typeof conversationId !== "string" || conversationId.length > 160) return;
      if (!canJoin(userId, conversationId)) return;
      void assertConversation(userId, conversationId)
        .then(() => socket.join(conversationId))
        .catch(() => {});
    });

    socket.on("conversation:history", async (conversationId: unknown, ack: unknown) => {
      const reply = typeof ack === "function" ? ack : () => {};
      try {
        if (typeof conversationId !== "string") throw new Error("Conversation not found");
        await assertConversation(userId, conversationId);
        socket.join(conversationId);
        const rows = await mongoose.connection
          .collection("messages")
          .find({ conversationId })
          .sort({ createdAt: -1 })
          .limit(200)
          .toArray();
        rows.reverse();
        reply({ ok: true, messages: await presentMessages(rows as unknown as MessageRow[]) });
      } catch (error) {
        reply({
          ok: false,
          message: error instanceof Error ? error.message : "Could not load messages",
        });
      }
    });

    socket.on("message:send", async (payload: unknown, ack: unknown) => {
      const reply = typeof ack === "function" ? ack : () => {};
      try {
        const data = payload && typeof payload === "object" ? payload : {};
        const conversationId =
          "conversationId" in data && typeof data.conversationId === "string"
            ? data.conversationId.trim()
            : "";
        const body = "body" in data && typeof data.body === "string" ? data.body.trim() : "";
        if (!body) throw new Error("Write a message");
        if (body.length > 2000) throw new Error("Message is too long");
        await assertConversation(userId, conversationId);

        const now = new Date();
        const inserted = await mongoose.connection.collection("messages").insertOne({
          conversationId,
          senderId: userId,
          body,
          createdAt: now,
          updatedAt: now,
        });
        const [saved] = await presentMessages([
          {
            _id: inserted.insertedId,
            senderId: userId,
            body,
            createdAt: now,
          },
        ]);
        const message = { ...saved, conversationId };
        socket.join(conversationId);
        io.to(conversationId).emit("message:new", message);
        reply({ ok: true, message });
      } catch (error) {
        reply({
          ok: false,
          message: error instanceof Error ? error.message : "Could not send the message",
        });
      }
    });
  });

  const port = Number(process.env.CHAT_SOCKET_PORT || 3001);
  globalState.__chatHttp = httpServer;
  globalState.__chatIo = io;
  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`> Chat socket ready on ${port}`);
      resolve();
    });
  });
}
