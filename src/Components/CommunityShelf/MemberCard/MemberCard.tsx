"use client";

import Image from "next/image";
import {
  ConfirmModal,
  StatusModal,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { CommunityMember } from "@/types/communityShelf";

interface MemberCardProps {
  member: CommunityMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  const feedback = useFeedback();
  const modalId = `member-${member.id}`;

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
          <Image
            src="/svg/book.svg"
            alt="Book"
            width={14}
            height={14}
            className="size-3.5 text-sky-500"
          />
          {member.booksBorrowed} borrowed
        </span>

        <button
          type="button"
          onClick={() => openModal(modalId)}
          className="btn btn-ghost btn-xs"
        >
          View Profile
        </button>
      </div>

      <ConfirmModal
        id={modalId}
        title={member.name}
        message={`${member.name} is reading "${member.currentlyReading.title}". Send a borrow request when they finish?`}
        confirmLabel="Request book"
        onConfirm={() => {
          feedback.success(
            "Request sent",
            `${member.name} will see your request for "${member.currentlyReading.title}".`,
          );
        }}
      />
      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </article>
  );
}
