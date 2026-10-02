import type { LibraryNotice } from "@/types/notice";
import type { Server } from "socket.io";

export const NOTICES_ROOM = "notices";

export async function publishNotice(notice: LibraryNotice) {
  const io = (globalThis as typeof globalThis & { __chatIo?: Server }).__chatIo;
  if (!io) {
    throw new Error("Live notification could not be delivered");
  }

  io.emit("notice:new", {
    id: notice.id,
    title: notice.title,
    message: notice.message,
    createdAt: notice.createdAt,
  });
}
