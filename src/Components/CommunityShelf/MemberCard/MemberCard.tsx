"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusModal, useFeedback } from "@/Components/Modal";
import type { CommunityBook, CommunityMember, FriendStatus } from "@/types/communityShelf";

interface MemberCardProps {
  viewerId: string;
  member: CommunityMember;
}

function BookLine({ book }: { book: CommunityBook }) {
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
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-800">{book.title}</p>
        <p className="truncate text-[11px] text-slate-500">{book.author}</p>
      </div>
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
                <BookLine key={`${member.id}-now-${book.title}`} book={book} />
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
                <BookLine key={`${member.id}-done-${book.title}`} book={book} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
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
