"use client";

import { getChatSocket } from "@/lib/chatSocket";
import { markNoticesRead, setViewingNotices } from "@/lib/noticeUnread";
import type { LibraryNotice } from "@/types/notice";
import { useEffect, useState } from "react";

interface UserNotificationsPageProps {
  notices: LibraryNotice[];
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function UserNotificationsPage({
  notices,
}: UserNotificationsPageProps) {
  const [items, setItems] = useState(notices);

  // badge stays off while they are looking at this page
  setViewingNotices(true);

  useEffect(() => {
    setItems(notices);
  }, [notices]);

  useEffect(() => {
    return () => setViewingNotices(false);
  }, []);

  useEffect(() => {
    void markNoticesRead();
  }, [items.length]);

  useEffect(() => {
    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onNotice(notice: LibraryNotice) {
      if (!notice?.id) return;

      setItems((current) => {
        const already = current.some((item) => item.id === notice.id);
        if (already) return current;
        return [notice, ...current];
      });
    }

    socket.on("connect", syncRooms);
    socket.on("notice:new", onNotice);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      socket.off("notice:new", onNotice);
    };
  }, []);

  return (
    <main className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-slate-800">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500">Messages from the library</p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-sm text-slate-400">
          No notifications yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((notice) => (
            <li
              key={notice.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-800">{notice.title}</h2>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatWhen(notice.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {notice.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
