import type { ReactNode } from "react";

export default function TextAction({
  label,
  tone = "sky",
  onClick,
  icon,
}: {
  label: string;
  tone?: "sky" | "green" | "red" | "slate";
  onClick?: () => void;
  icon?: ReactNode;
}) {
  const tones = {
    sky: "btn-info btn-soft",
    green: "btn-success btn-soft",
    red: "btn-error btn-soft",
    slate: "btn-ghost",
  };

  return (
    <button type="button" onClick={onClick} className={`btn btn-xs ${tones[tone]}`}>
      {icon}
      {label}
    </button>
  );
}
