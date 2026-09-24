import Image from "next/image";
import type {
  BorrowRequestStatus,
  IncomingBorrowRequest,
} from "@/types/borrowRequests";

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
    className: "badge-soft badge-warning",
  },
  approved: {
    label: "Approved",
    className: "badge-soft badge-success",
  },
  declined: {
    label: "Cancelled",
    className: "badge-soft badge-error",
  },
};

export default function RequestCard({
  request,
  onApprove,
  onDecline,
}: RequestCardProps) {
  const badge = statusBadge[request.status];
  const showActions =
    request.status === "pending" && (onApprove != null || onDecline != null);

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
            <h3 className="font-semibold text-slate-800">{request.bookTitle}</h3>
            <span className={`badge badge-sm gap-1 ${badge.className}`}>
              {request.status === "pending" && (
                <span className="size-1.5 rounded-full bg-sky-500" />
              )}
              {badge.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-sky-600">Your request to the library</p>

          <p className="mt-1 text-xs text-slate-400">
            Requested {request.requestedAt}
            {request.expectedReturn
              ? ` · return ${request.expectedReturn}`
              : ""}
          </p>
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
              className="btn btn-success btn-sm flex-1 sm:flex-none"
            >
              <Image
                src="/svg/check.svg"
                alt="Confirm"
                width={16}
                height={16}
                className="size-4"
              />
              Approve
            </button>

            <button
              type="button"
              onClick={() => onDecline?.(request.id)}
              className="btn btn-error btn-outline btn-sm flex-1 sm:flex-none"
            >
              <Image
                src="/svg/x.svg"
                alt="Close"
                width={16}
                height={16}
                className="size-4"
              />
              Decline
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
