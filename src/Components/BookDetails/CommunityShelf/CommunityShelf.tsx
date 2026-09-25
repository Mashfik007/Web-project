"use client";

import Image from "next/image";
import { useState } from "react";
import { StatusModal, useFeedback } from "@/Components/Modal";
import type { BookDetails } from "@/types/bookDetails";

interface CommunityShelfProps {
  community: BookDetails["community"];
  bookId: string;
}

export default function CommunityShelf({ community, bookId }: CommunityShelfProps) {
  const feedback = useFeedback();
  const [busyId, setBusyId] = useState("");
  const visibleMembers = community.members.slice(0, 4);

  async function requestFrom(memberId: string) {
    setBusyId(memberId);
    try {
      const response = await fetch("/api/users/community/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: memberId, bookId }),
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
      setBusyId("");
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Image
            src="/svg/users.svg"
            alt="Users"
            width={16}
            height={16}
            className="size-4"
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Community Shelf</h3>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {community.totalOnShelf} members have this on their shelf right now
      </p>

      <div className="mt-4 flex -space-x-2">
        {community.members.map((member) => (
          <span
            key={member.id}
            className={`flex size-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${member.color}`}
            title={member.name}
          >
            {member.initials}
          </span>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {visibleMembers.length === 0 ? (
          <li className="text-xs text-slate-400">No other reader has this checked out.</li>
        ) : (
          visibleMembers.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${member.color}`}
                >
                  {member.initials}
                </span>
                <span className="truncate font-medium text-slate-700">{member.name}</span>
              </div>
              <button
                type="button"
                disabled={busyId === member.id}
                onClick={() => {
                  void requestFrom(member.id);
                }}
                className="btn btn-primary btn-xs shrink-0"
              >
                Request
              </button>
            </li>
          ))
        )}
      </ul>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </article>
  );
}
