"use client";

import { useState, type FormEvent, type ReactNode } from "react";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AppModal({
  open,
  onClose,
  title,
  children,
  footer,
}: AppModalProps) {
  if (!open) return null;

  return (
    <dialog className="modal modal-open" open onCancel={onClose}>
      <div className="modal-box">
        {title ? (
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl font-bold">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-circle btn-ghost btn-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ) : null}
        {children}
        {footer ? <div className="modal-action">{footer}</div> : null}
      </div>
      <form
        method="dialog"
        className="modal-backdrop"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  as = "input",
  options,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  options?: string[];
}) {
  return (
    <fieldset className="fieldset p-0">
      <legend className="fieldset-legend">{label}</legend>
      {as === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          rows={4}
          className="textarea w-full"
        />
      ) : as === "select" ? (
        <select
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="select w-full"
        >
          {(options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className="input w-full"
        />
      )}
    </fieldset>
  );
}

export function ModalButton({
  children,
  onClick,
  type = "button",
  tone = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  tone?: "primary" | "secondary" | "danger" | "success";
}) {
  const tones = {
    primary: "btn-primary",
    secondary: "btn-ghost",
    danger: "btn-error",
    success: "btn-success",
  };

  return (
    <button type={type} onClick={onClick} className={`btn ${tones[tone]}`}>
      {children}
    </button>
  );
}

export function StatusModal({
  open,
  onClose,
  variant,
  title,
  message,
  buttonLabel = "Continue",
}: {
  open: boolean;
  onClose: () => void;
  variant: "success" | "failed";
  title: string;
  message: string;
  buttonLabel?: string;
}) {
  const isSuccess = variant === "success";

  return (
    <AppModal
      open={open}
      onClose={onClose}
      footer={
        <ModalButton onClick={onClose} tone={isSuccess ? "primary" : "danger"}>
          {buttonLabel}
        </ModalButton>
      }
    >
      <div className="flex flex-col items-center px-2 pt-2 pb-1 text-center">
        <span
          className={`mb-4 flex size-16 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-success/10 text-success"
              : "bg-error/10 text-error"
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

export function FormModal({
  open,
  onClose,
  title,
  children,
  submitLabel = "Save",
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  onSubmit: (form: HTMLFormElement) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(event.currentTarget);
  }

  return (
    <AppModal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {children}
        <div className="modal-action">
          <ModalButton tone="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton type="submit">{submitLabel}</ModalButton>
        </div>
      </form>
    </AppModal>
  );
}

export function ConfirmModal({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  tone = "primary",
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "primary" | "danger" | "success";
  onConfirm: () => void;
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <ModalButton tone="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton tone={tone} onClick={onConfirm}>
            {confirmLabel}
          </ModalButton>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-base-content/60">{message}</p>
    </AppModal>
  );
}

export function formHasValues(form: HTMLFormElement, names: string[]) {
  const data = new FormData(form);
  return names.every((name) => String(data.get(name) ?? "").trim().length > 0);
}

export type FeedbackStatus = {
  variant: "success" | "failed";
  title: string;
  message: string;
} | null;

export function useFeedback() {
  const [status, setStatus] = useState<FeedbackStatus>(null);

  return {
    status,
    closeStatus: () => setStatus(null),
    success: (title: string, message: string) =>
      setStatus({ variant: "success", title, message }),
    failed: (title: string, message: string) =>
      setStatus({ variant: "failed", title, message }),
  };
}
