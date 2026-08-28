"use client";

import { useState } from "react";
import type { CommunityBorrowTracker, CommunityBorrowStep } from "@/types/communityShelf";

interface BorrowRequestsProps {
  requests: CommunityBorrowTracker[];
  activeCount: number;
}

const STEPS: { id: CommunityBorrowStep; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "on-loan", label: "On Loan" },
  { id: "returned", label: "Returned" },
];

const stepIndex: Record<CommunityBorrowStep, number> = {
  pending: 0,
  approved: 1,
  "on-loan": 2,
  returned: 3,
};

const nextStep: Record<CommunityBorrowStep, CommunityBorrowStep> = {
  pending: "approved",
  approved: "on-loan",
  "on-loan": "returned",
  returned: "returned",
};

function RequestStepper({ currentStep }: { currentStep: CommunityBorrowStep }) {
  const currentIndex = stepIndex[currentStep];

  return (
    <div className="mt-3 flex items-center gap-1">
      {STEPS.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`size-2.5 rounded-full ${
                  isActive ? "bg-sky-500" : "bg-slate-200"
                } ${isCurrent ? "ring-2 ring-sky-200" : ""}`}
              />
              <span
                className={`text-[9px] font-medium ${
                  isActive ? "text-sky-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-1 mb-4 h-0.5 flex-1 ${
                  index < currentIndex ? "bg-sky-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BorrowRequests({
  requests: initialRequests,
  activeCount,
}: BorrowRequestsProps) {
  const [requests, setRequests] = useState(initialRequests);

  function simulateNextStep(id: string) {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, currentStep: nextStep[request.currentStep] }
          : request,
      ),
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-800">
          Borrow Requests
        </h3>
        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
          {activeCount} active
        </span>
      </div>

      <ul className="mt-4 space-y-5">
        {requests.map((request) => (
          <li
            key={request.id}
            className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${request.dotColor}`}
              />
              <p className="text-xs text-slate-500">
                Requested from{" "}
                <span className="font-semibold text-slate-700">
                  {request.requestedFrom}
                </span>
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-400">{request.bookTitle}</p>

            <RequestStepper currentStep={request.currentStep} />

            {request.currentStep !== "returned" && (
              <button
                type="button"
                onClick={() => simulateNextStep(request.id)}
                className="mt-2 text-[10px] font-medium text-sky-600 hover:underline"
              >
                Simulate next step
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
