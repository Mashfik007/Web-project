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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
        {title ? (
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ) : null}
        {children}
        {footer ? (
          <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>
        ) : null}
      </div>
    </div>
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
  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400";

  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          rows={4}
          className={fieldClass}
        />
      ) : as === "select" ? (
        <select
          name={name}
          defaultValue={defaultValue}
          required={required}
          className={fieldClass}
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
          className={fieldClass}
        />
      )}
    </label>
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
    primary: "bg-sky-500 text-white hover:bg-sky-600",
    secondary: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${tones[tone]}`}
    >
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
            isSuccess ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
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
        <h2 className="font-serif text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p>
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
        <div className="flex justify-end gap-2 pt-2">
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
          <ModalButton
            tone={tone}
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmLabel}
          </ModalButton>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-slate-500">{message}</p>
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
