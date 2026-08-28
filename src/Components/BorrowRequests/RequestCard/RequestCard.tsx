import Image from "next/image";
import type { BorrowRequestStatus, IncomingBorrowRequest } from "@/types/borrowRequests";

interface RequestCardProps {
  request: IncomingBorrowRequest;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const statusBadge: Record<
  BorrowRequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "badge-outline border-sky-200 bg-sky-50 text-sky-700",
  },
  approved: {
    label: "Approved",
    className: "badge-outline border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  declined: {
    label: "Declined",
    className: "badge-ghost text-slate-500",
  },
};

export default function RequestCard({
  request,
  onApprove,
  onDecline,
}: RequestCardProps) {
  const badge = statusBadge[request.status];
  const showActions = request.status === "pending";

  return (
    <article className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="card-body flex-row flex-wrap items-center gap-4 p-5">
        <div className="avatar placeholder shrink-0">
          <div
            className={`flex size-12 items-center justify-center rounded-full ${request.avatarColor}`}
          >
            <span className="text-sm font-semibold">{request.initials}</span>
          </div>
        </div>

        <div className="min-w-[200px] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-800">{request.userName}</h3>
            <span className={`badge badge-sm gap-1 ${badge.className}`}>
              {request.status === "pending" && (
                <span className="size-1.5 rounded-full bg-sky-500" />
              )}
              {badge.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-sky-600">
            Wants to borrow{" "}
            <span className="font-semibold text-slate-800">
              &ldquo;{request.bookTitle}&rdquo;
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-400">{request.requestedAt}</p>
        </div>

        <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={request.coverImage}
            alt={request.bookTitle}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        {showActions && (
          <div className="flex w-full shrink-0 gap-2 sm:ml-auto sm:w-auto">
            <button
              type="button"
              onClick={() => onApprove?.(request.id)}
              className="btn btn-info btn-sm flex-1 gap-1.5 rounded-xl border-0 bg-sky-500 text-white hover:bg-sky-600 sm:flex-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Approve
            </button>

            <button
              type="button"
              onClick={() => onDecline?.(request.id)}
              className="btn btn-outline btn-sm flex-1 gap-1.5 rounded-xl border-slate-200 bg-white text-slate-500 hover:bg-slate-50 sm:flex-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              Decline
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
