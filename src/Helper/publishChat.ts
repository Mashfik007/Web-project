import type { Server } from "socket.io";
import type { LiveChatMessage } from "@/types/chat";

export function publishChatMessage(message: LiveChatMessage) {
  const io = (global as typeof globalThis & { __chatIo?: Server }).__chatIo;
  io?.to(message.conversationId).emit("message:new", message);
}
