import type { ReactNode } from "react";

export default function ModalButton({
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
