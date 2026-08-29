"use client";

import { useState } from "react";
import {
  ConfirmModal,
  StatusModal,
  useFeedback,
} from "@/Components/Modal/AppModal";

export default function AutoHoldBanner() {
  const [confirming, setConfirming] = useState(false);
  const feedback = useFeedback();

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Auto-Hold</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Get notified when a copy becomes available. We&apos;ll hold it for
            you automatically.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="shrink-0 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        Enable Hold
      </button>

      <ConfirmModal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Enable auto-hold"
        message="We'll notify you and hold the next available copy for 48 hours."
        confirmLabel="Enable"
        tone="success"
        onConfirm={() => {
          setConfirming(false);
          feedback.success(
            "Auto-hold enabled",
            "You'll get a notification as soon as a copy is free.",
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
    </div>
  );
}
