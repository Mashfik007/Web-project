"use client";

import AppModal, { closeModal } from "@/Components/Modal/AppModal/AppModal";
import ModalButton from "@/Components/Modal/ModalButton/ModalButton";

// yes / no popup (delete, approve, etc.)
interface ConfirmModalProps {
  id: string;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "primary" | "danger" | "success";
  onConfirm: () => void;
}

export default function ConfirmModal({
  id,
  title,
  message,
  confirmLabel,
  tone = "primary",
  onConfirm,
}: ConfirmModalProps) {
  return (
    <AppModal
      id={id}
      title={title}
      footer={
        <>
          <form method="dialog">
            <ModalButton type="submit" tone="secondary">
              Cancel
            </ModalButton>
          </form>
          <ModalButton
            tone={tone}
            onClick={() => {
              closeModal(id);
              onConfirm();
            }}
          >
            {confirmLabel}
          </ModalButton>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-base-content/60">{message}</p>
    </AppModal>
  );
}
