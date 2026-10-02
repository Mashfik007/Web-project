"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusModal, useFeedback } from "@/Components/Modal";
import { getChatSocket } from "@/lib/chatSocket";
import type { CommunityBook, CommunityMember, FriendStatus } from "@/types/communityShelf";
import type { FriendUpdatePayload } from "@/types/realtime";

interface MemberCardProps {
  viewerId: string;
  member: CommunityMember;
}

function statusFromUpdate(
  viewerId: string,
  memberId: string,
  update: FriendUpdatePayload,
): FriendStatus | null {
  const involvesMember =
    (update.fromId === viewerId && update.toId === memberId) ||
    (update.fromId === memberId && update.toId === viewerId);
  if (!involvesMember) return null;

  if (update.action === "accept") return "friends";
  if (update.action === "decline" || update.action === "cancel") return "none";
  if (update.action === "request") {
    return update.fromId === viewerId ? "outgoing" : "incoming";
  }
  return null;
}

function BookLine({
  book,
  busy,
  onRequest,
}: {
  book: CommunityBook;
  busy: boolean;
  onRequest?: (bookId: string) => void;
}) {
  return (
    <li className="flex items-center gap-2">
      <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          sizes="32px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-800">{book.title}</p>
        <p className="truncate text-[11px] text-slate-500">{book.author}</p>
      </div>
      {book.id && onRequest ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onRequest(book.id!)}
          className="btn btn-primary btn-xs shrink-0"
        >
          Request
        </button>
      ) : null}
    </li>
  );
}

export default function MemberCard({ viewerId, member }: MemberCardProps) {
  const router = useRouter();
  const feedback = useFeedback();
  const [status, setStatus] = useState<FriendStatus>(member.friendStatus);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStatus(member.friendStatus);
  }, [member.friendStatus]);

  useEffect(() => {
    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onFriendUpdate(update: FriendUpdatePayload) {
      if (!update?.action || !update.fromId || !update.toId) return;

      const next = statusFromUpdate(viewerId, member.id, update);
      if (next) setStatus(next);

      if (update.actorId === viewerId) return;
      if (update.fromId !== viewerId && update.toId !== viewerId) return;
      if (update.fromId !== member.id && update.toId !== member.id) return;

      if (update.action === "request" && update.toId === viewerId) {
        feedback.success("Friend request", `${update.actorName} sent you a friend request.`);
      } else if (update.action === "accept" && update.fromId === viewerId) {
        feedback.success("Friends", `${update.actorName} accepted your friend request.`);
      } else if (update.action === "decline" && update.fromId === viewerId) {
        feedback.failed("Friend request", `${update.actorName} declined your friend request.`);
      } else if (update.action === "cancel" && update.toId === viewerId) {
        feedback.failed("Friend request", `${update.actorName} cancelled their friend request.`);
      }
    }

    socket.on("connect", syncRooms);
    socket.on("friend:update", onFriendUpdate);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      socket.off("friend:update", onFriendUpdate);
    };
  }, [viewerId, member.id]);

  async function requestBook(bookId: string) {
    setBusy(true);
    try {
      const response = await fetch("/api/users/community/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: member.id, bookId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed("Borrow request", payload.message || "Could not send the request");
        return;
      }
      feedback.success("Borrow request", payload.message || "Request sent");
    } catch {
      feedback.failed("Borrow request", "Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function send(action: "request" | "accept" | "decline" | "cancel") {
    setBusy(true);
    try {
      const response = await fetch("/api/users/community/friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: viewerId, targetId: member.id, action }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed("Friend request", payload.message || "Could not update the request");
        return;
      }
      if (payload.data?.friendStatus) setStatus(payload.data.friendStatus);
      feedback.success("Friends", payload.message || "Updated");
      router.refresh();
    } catch {
      feedback.failed("Friend request", "Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${member.avatarColor}`}
          >
            {member.initials}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{member.name}</h3>
            <p className="text-xs text-slate-400">{member.location}</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
          {member.streakDays} day streak
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-[9px] font-semibold tracking-wider text-sky-600 uppercase">
            Reading now
          </p>
          {member.readingNow.length === 0 ? (
            <p className="mt-1 text-xs text-slate-400">Nothing checked out</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {member.readingNow.map((book) => (
                <BookLine
                  key={`${member.id}-now-${book.title}`}
                  book={book}
                  busy={busy}
                  onRequest={(bookId) => {
                    void requestBook(bookId);
                  }}
                />
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-[9px] font-semibold tracking-wider text-emerald-600 uppercase">
            Finished
          </p>
          {member.finished.length === 0 ? (
            <p className="mt-1 text-xs text-slate-400">No finished books yet</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {member.finished.map((book) => (
                <BookLine key={`${member.id}-done-${book.title}`} book={book} busy={false} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Link href={`/user/${viewerId}/chat?with=${member.id}`} className="btn btn-ghost btn-xs">
          Message
        </Link>
        {status === "friends" && (
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
            Friends
          </span>
        )}
        {status === "none" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => send("request")}
            className="btn btn-primary btn-xs"
          >
            Add friend
          </button>
        )}
        {status === "outgoing" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => send("cancel")}
            className="btn btn-ghost btn-xs"
          >
            Cancel request
          </button>
        )}
        {status === "incoming" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => send("decline")}
              className="btn btn-ghost btn-xs"
            >
              Decline
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => send("accept")}
              className="btn btn-primary btn-xs"
            >
              Accept
            </button>
          </>
        )}
      </div>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </article>
  );
}
