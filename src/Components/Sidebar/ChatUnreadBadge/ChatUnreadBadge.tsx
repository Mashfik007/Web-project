"use client";

import { CHAT_UNREAD_EVENT, getViewingConversation } from "@/lib/chatUnread";
import { getChatSocket } from "@/lib/chatSocket";
import type { LiveChatMessage } from "@/types/chat";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ChatUnreadBadge({
  userId,
  initialCount,
}: {
  userId: string;
  initialCount: number;
}) {
  const pathname = usePathname();
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onMessage(message: LiveChatMessage) {
      if (message.senderId === userId) return;
      if (message.conversationId === getViewingConversation()) return;
      setCount((current) => current + 1);
    }

    function onUnread(event: Event) {
      const detail = (event as CustomEvent<number>).detail;
      if (typeof detail === "number") setCount(detail);
    }

    socket.on("connect", syncRooms);
    socket.on("message:new", onMessage);
    window.addEventListener(CHAT_UNREAD_EVENT, onUnread);
    window.addEventListener("focus", syncRooms);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      socket.off("message:new", onMessage);
      window.removeEventListener(CHAT_UNREAD_EVENT, onUnread);
      window.removeEventListener("focus", syncRooms);
    };
  }, [pathname, userId]);

  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none font-bold text-white">
      {label}
    </span>
  );
}
