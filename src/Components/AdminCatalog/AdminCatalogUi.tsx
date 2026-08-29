import type { ReactNode } from "react";

interface AdminPageShellProps {
  title: string;
  subtitle: string;
  addLabel?: string;
  onAdd?: () => void;
  headerRight?: ReactNode;
  framed?: boolean;
  children: ReactNode;
}

export function AdminPageShell({
  title,
  subtitle,
  addLabel,
  onAdd,
  headerRight,
  framed = true,
  children,
}: AdminPageShellProps) {
  return (
    <main className="min-h-full bg-base-200 p-5 md:p-7 lg:p-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="mt-1 text-sm text-base-content/50">{subtitle}</p>
        </div>
        {headerRight ??
          (addLabel ? (
            <button type="button" onClick={onAdd} className="btn btn-primary">
              <span className="text-base leading-none">+</span>
              {addLabel}
            </button>
          ) : null)}
      </header>
      {framed ? (
        <section className="card bg-base-100 shadow-sm">{children}</section>
      ) : (
        children
      )}
    </main>
  );
}

interface AdminTableProps {
  columns: string[];
  children: ReactNode;
  from: number;
  to: number;
  total: number;
}

export function AdminTable({
  columns,
  children,
  from,
  to,
  total,
}: AdminTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-base-200 px-4 py-3">
        <p className="text-xs text-base-content/40">
          Showing {from}-{to} of {total} records
        </p>
        <div className="join">
          <button type="button" className="btn join-item btn-sm btn-ghost">
            ‹
          </button>
          <button type="button" className="btn join-item btn-sm btn-primary">
            1
          </button>
          <button type="button" className="btn join-item btn-sm">
            2
          </button>
          <button type="button" className="btn join-item btn-sm btn-ghost">
            ›
          </button>
        </div>
      </div>
    </>
  );
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "orange" | "purple" | "red" | "slate" | "sky" | "teal";
}) {
  const tones = {
    green: "badge-success",
    orange: "badge-warning",
    purple: "badge-secondary",
    red: "badge-error",
    slate: "badge-ghost",
    sky: "badge-info",
    teal: "badge-accent",
  };

  return (
    <span
      className={`badge badge-sm ${tone === "slate" ? tones[tone] : `badge-soft ${tones[tone]}`}`}
    >
      {label}
    </span>
  );
}

function IconButton({
  label,
  className,
  children,
  onClick,
}: {
  label: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`btn btn-ghost btn-square btn-sm ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function EditButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton label="Edit" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </IconButton>
  );
}

export function ViewButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton label="View" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
      >
        <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </IconButton>
  );
}

export function DeleteButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Delete"
      onClick={onClick}
      className="btn btn-error btn-soft btn-square btn-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
      </svg>
    </button>
  );
}

export function AdminSearchRow({
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

export function FilterSelect({
  name,
  options,
}: {
  name: string;
  options: string[];
}) {
  return (
    <select name={name} defaultValue="All" className="select">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
