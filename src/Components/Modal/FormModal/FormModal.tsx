"use client";

import { type FormEvent, type ReactNode } from "react";
import AppModal, { closeModal } from "@/Components/Modal/AppModal/AppModal";
import ModalButton from "@/Components/Modal/ModalButton/ModalButton";

interface FormModalProps {
  id: string;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  onSubmit: (form: HTMLFormElement) => void;
}

export default function FormModal({
  id,
  title,
  children,
  submitLabel = "Save",
  onSubmit,
}: FormModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(event.currentTarget);
    closeModal(id);
  }

  return (
    <AppModal id={id} title={title}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {children}
        <div className="modal-action">
          <ModalButton tone="secondary" onClick={() => closeModal(id)}>
            Cancel
          </ModalButton>
          <ModalButton type="submit" >{submitLabel}</ModalButton>
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
