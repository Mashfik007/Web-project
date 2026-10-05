import type { ReactNode } from "react";

export default function ModalButton({
  children,
  onClick,
  type = "button",
  tone = "primary",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  tone?: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
}) {
  const tones = {
    primary: "btn-primary",
    secondary: "btn-ghost",
    danger: "btn-error",
    success: "btn-success",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${tones[tone]}`}
    >
      {children}
    </button>
  );
}
