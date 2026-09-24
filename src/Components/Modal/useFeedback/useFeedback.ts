"use client";

import { useEffect, useId, useState } from "react";
import { openModal } from "@/Components/Modal/AppModal/AppModal";

export type FeedbackStatus = {
  variant: "success" | "failed";
  title: string;
  message: string;
};

// small hook so pages can show the success / failed modal
export function useFeedback(id?: string) {
  const reactId = useId().replace(/:/g, "");
  const modalId = id ?? `status-${reactId}`;
  const [status, setStatus] = useState<FeedbackStatus>({
    variant: "success",
    title: "",
    message: "",
  });
  const [ticket, setTicket] = useState(0);

  useEffect(() => {
    if (ticket === 0) return;
    openModal(modalId);
  }, [ticket, modalId]);

  function show(
    variant: FeedbackStatus["variant"],
    title: string,
    message: string,
  ) {
    setStatus({ variant, title, message });
    setTicket((current) => current + 1);
  }

  return {
    id: modalId,
    status,
    success: (title: string, message: string) =>
      show("success", title, message),
    failed: (title: string, message: string) => show("failed", title, message),
  };
}
