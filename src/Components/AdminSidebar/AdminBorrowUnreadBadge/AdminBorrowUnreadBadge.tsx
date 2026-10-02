"use client";

import {
  ADMIN_BORROW_UNREAD_EVENT,
  bumpAdminBorrowUnread,
  isViewingAdminBorrowRequests,
  readAdminBorrowUnread,
} from "@/lib/adminBorrowUnread";
import { getChatSocket } from "@/lib/chatSocket";
import type { BorrowUpdatePayload } from "@/types/realtime";
import { useEffect, useState } from "react";

export default function AdminBorrowUnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(readAdminBorrowUnread());

    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onBorrowUpdate(update: BorrowUpdatePayload) {
      if (update?.scope !== "library" || update.action !== "created") return;
      if (isViewingAdminBorrowRequests()) return;
      bumpAdminBorrowUnread();
    }

    function onUnread(event: Event) {
      const detail = (event as CustomEvent<number>).detail;
      if (typeof detail === "number") setCount(detail);
    }

    socket.on("connect", syncRooms);
    socket.on("borrow:update", onBorrowUpdate);
    window.addEventListener(ADMIN_BORROW_UNREAD_EVENT, onUnread);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      socket.off("borrow:update", onBorrowUpdate);
      window.removeEventListener(ADMIN_BORROW_UNREAD_EVENT, onUnread);
    };
  }, []);

  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none font-bold text-white">
      {label}
    </span>
  );
}
