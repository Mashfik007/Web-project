"use client";

import { getChatSocket } from "@/lib/chatSocket";
import { isViewingNotices, NOTICE_UNREAD_EVENT } from "@/lib/noticeUnread";
import type { LibraryNotice } from "@/types/notice";
import { useEffect, useState } from "react";

export default function NoticeUnreadBadge({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onNotice(notice: LibraryNotice) {
      if (!notice?.id || isViewingNotices()) return;
      setCount((current) => current + 1);
    }

    function onUnread(event: Event) {
      const detail = (event as CustomEvent<number>).detail;
      if (typeof detail === "number") setCount(detail);
    }

    socket.on("connect", syncRooms);
    socket.on("notice:new", onNotice);
    window.addEventListener(NOTICE_UNREAD_EVENT, onUnread);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      socket.off("notice:new", onNotice);
      window.removeEventListener(NOTICE_UNREAD_EVENT, onUnread);
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
