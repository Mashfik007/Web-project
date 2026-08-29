"use client";

import { useId, useState } from "react";
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

  function show(
    variant: FeedbackStatus["variant"],
    title: string,
    message: string,
  ) {
    setStatus({ variant, title, message });
    openModal(modalId);
  }

  return {
    id: modalId,
    status,
    success: (title: string, message: string) =>
      show("success", title, message),
    failed: (title: string, message: string) => show("failed", title, message),
  };
}
