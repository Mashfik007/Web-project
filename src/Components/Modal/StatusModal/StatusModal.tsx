"use client";

import AppModal from "@/Components/Modal/AppModal/AppModal";
import ModalButton from "@/Components/Modal/ModalButton/ModalButton";

// success / error message after save, delete, etc.
interface StatusModalProps {
  id: string;
  variant: "success" | "failed";
  title: string;
  message: string;
  buttonLabel?: string;
}

export default function StatusModal({
  id,
  variant,
  title,
  message,
  buttonLabel = "Continue",
}: StatusModalProps) {
  const isSuccess = variant === "success";

  return (
    <AppModal
      id={id}
      footer={
        <form method="dialog">
          <ModalButton type="submit" tone={isSuccess ? "primary" : "danger"}>
            {buttonLabel}
          </ModalButton>
        </form>
      }
    >
      <div className="flex flex-col items-center px-2 pt-2 pb-1 text-center">
        <span
          className={`mb-4 flex size-16 items-center justify-center rounded-full ${
            isSuccess ? "bg-success/10 text-success" : "bg-error/10 text-error"
          }`}
        >
          {isSuccess ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="size-8"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="size-8"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          )}
        </span>
        <h2 className="font-serif text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-base-content/60">
          {message}
        </p>
      </div>
    </AppModal>
  );
}
