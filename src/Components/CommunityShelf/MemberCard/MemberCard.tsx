"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ConfirmModal,
  StatusModal,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { CommunityMember } from "@/types/communityShelf";

interface MemberCardProps {
  member: CommunityMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  const [requesting, setRequesting] = useState(false);
  const feedback = useFeedback();

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
            <h3 className="text-sm font-semibold text-slate-800">
              {member.name}
            </h3>
            <p className="text-xs text-slate-400">{member.location}</p>
          </div>
        </div>

        {member.isFriend && (
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
            Friend
          </span>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/80 p-3">
        <p className="text-[9px] font-semibold tracking-wider text-sky-600 uppercase">
          Reading Now
        </p>
        <div className="mt-2 flex gap-3">
          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={member.currentlyReading.coverImage}
              alt={member.currentlyReading.title}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {member.currentlyReading.title}
            </p>
            <p className="truncate text-xs text-slate-500">
              {member.currentlyReading.author}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5 text-sky-500"
          >
            <path d="M12 7v14" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </svg>
          {member.booksBorrowed} borrowed
        </span>

        <button
          type="button"
          onClick={() => setRequesting(true)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          View Profile
        </button>
      </div>

      <ConfirmModal
        open={requesting}
        onClose={() => setRequesting(false)}
        title={member.name}
        message={`${member.name} is reading "${member.currentlyReading.title}". Send a borrow request when they finish?`}
        confirmLabel="Request book"
        onConfirm={() => {
          setRequesting(false);
          feedback.success(
            "Request sent",
            `${member.name} will see your request for "${member.currentlyReading.title}".`,
          );
        }}
      />
      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </article>
  );
}
