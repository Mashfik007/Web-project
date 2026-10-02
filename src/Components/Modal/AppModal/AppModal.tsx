"use client";

// daisyUI dialog helpers — openModal("id") / closeModal("id")
import type { ReactNode } from "react";

// DaisyUI modal is just a <dialog>. No React open state.
export function getModal(id: string) {
  return document.getElementById(id) as HTMLDialogElement | null;
}

export function openModal(id: string) {
  // wait a frame so form fields can update first (edit book, etc.)
  requestAnimationFrame(() => {
    document.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach((dialog) => {
      if (dialog.id !== id) {
        dialog.close();
      }
    });
    const modal = getModal(id);
    if (modal && !modal.open) {
      modal.showModal();
    }
  });
}

export function closeModal(id: string) {
  getModal(id)?.close();
}

interface AppModalProps {
  id: string;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AppModal({
  id,
  title,
  children,
  footer,
}: AppModalProps) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {title ? (
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl font-bold">{title}</h3>
            <form method="dialog">
              <button
                type="submit"
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Close"
              >
                ✕
              </button>
            </form>
          </div>
        ) : null}
        {children}
        {footer ? <div className="modal-action">{footer}</div> : null}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}
