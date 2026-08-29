import type { ReactNode } from "react";

export default function AdminSearchRow({
  placeholder,
  children,
}: {
  placeholder: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-base-200 p-4 md:flex-row md:items-center">
      <label className="input w-full min-w-0 flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4 opacity-50"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input name="search" type="search" placeholder={placeholder} />
      </label>
      {children}
    </div>
  );
}
