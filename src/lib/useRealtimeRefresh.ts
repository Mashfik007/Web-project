"use client";

import { getChatSocket } from "@/lib/chatSocket";
import { REALTIME_REFRESH_EVENTS } from "@/types/realtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Keep the current route fresh when any domain socket event arrives. */
export function useRealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onUpdate() {
      router.refresh();
    }

    socket.on("connect", syncRooms);
    for (const event of REALTIME_REFRESH_EVENTS) {
      socket.on(event, onUpdate);
    }
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      for (const event of REALTIME_REFRESH_EVENTS) {
        socket.off(event, onUpdate);
      }
    };
  }, [router]);
}
