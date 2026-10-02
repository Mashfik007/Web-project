"use client";

import { getChatSocket } from "@/lib/chatSocket";
import {
  bumpNavUnread,
  navUnreadEventName,
  publishNavUnread,
  readNavUnread,
  setViewingNavUnread,
} from "@/lib/realtimeNavUnread";
import { useEffect, useRef, useState } from "react";

type RealtimeNavBadgeProps = {
  unreadKey: string;
  events: readonly string[];
  /** True while this nav section is open — clears the badge. */
  active: boolean;
  shouldCount?: (event: string, payload: unknown) => boolean;
};

export default function RealtimeNavBadge({
  unreadKey,
  events,
  active,
  shouldCount,
}: RealtimeNavBadgeProps) {
  const [count, setCount] = useState(0);
  const shouldCountRef = useRef(shouldCount);
  shouldCountRef.current = shouldCount;

  useEffect(() => {
    setViewingNavUnread(unreadKey, active);
    if (active) publishNavUnread(unreadKey, 0);
    return () => setViewingNavUnread(unreadKey, false);
  }, [active, unreadKey]);

  useEffect(() => {
    setCount(readNavUnread(unreadKey));

    const socket = getChatSocket();
    const eventName = navUnreadEventName(unreadKey);
    const eventList = [...events];

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onDomainEvent(event: string) {
      return (payload: unknown) => {
        const filter = shouldCountRef.current;
        if (filter && !filter(event, payload)) return;
        bumpNavUnread(unreadKey);
      };
    }

    function onUnread(event: Event) {
      const detail = (event as CustomEvent<number>).detail;
      if (typeof detail === "number") setCount(detail);
    }

    const handlers = eventList.map((event) => {
      const handler = onDomainEvent(event);
      socket.on(event, handler);
      return { event, handler };
    });

    socket.on("connect", syncRooms);
    window.addEventListener(eventName, onUnread);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      for (const { event, handler } of handlers) {
        socket.off(event, handler);
      }
      window.removeEventListener(eventName, onUnread);
    };
  }, [events, unreadKey]);

  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none font-bold text-white">
      {label}
    </span>
  );
}
