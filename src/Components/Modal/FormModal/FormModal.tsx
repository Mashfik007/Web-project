"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import AppModal, { closeModal } from "@/Components/Modal/AppModal/AppModal";
import ModalButton from "@/Components/Modal/ModalButton/ModalButton";

interface FormModalProps {
  id: string;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  loadingLabel?: string;
  onSubmit: (form: HTMLFormElement) => void | boolean | Promise<void | boolean>;
}

export default function FormModal({
  id,
  title,
  children,
  submitLabel = "Save",
  loadingLabel = "Saving...",
  onSubmit,
}: FormModalProps) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    try {
      const result = await onSubmit(event.currentTarget);
      if (result === false) return;
      closeModal(id);
    } finally {
      setPending(false);
    }
  }

  return (
    <AppModal id={id} title={title}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <fieldset disabled={pending} className="min-w-0 space-y-3 border-0 p-0">
          {children}
        </fieldset>
        <div className="modal-action">
          <ModalButton
            tone="secondary"
            disabled={pending}
            onClick={() => closeModal(id)}
          >
            Cancel
          </ModalButton>
          <ModalButton type="submit" disabled={pending}>
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                {loadingLabel}
              </span>
            ) : (
              submitLabel
            )}
          </ModalButton>
        </div>
      </form>
    </AppModal>
  );
}

// returns true if every listed field has some text
export function formHasValues(form: HTMLFormElement, names: string[]) {
  const data = new FormData(form);
  return names.every((name) => String(data.get(name) ?? "").trim().length > 0);
}
