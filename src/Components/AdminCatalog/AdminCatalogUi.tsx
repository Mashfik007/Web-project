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
    <main className="min-h-full bg-[#F9FAFB] p-5 md:p-7 lg:p-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {headerRight ??
          (addLabel ? (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              <span className="text-base leading-none">+</span>
              {addLabel}
            </button>
          ) : null)}
      </header>
      {framed ? (
        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          {children}
        </section>
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
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-[11px] font-semibold tracking-wide text-slate-400 uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <p className="text-xs text-slate-400">
          Showing {from}-{to} of {total} records
        </p>
        <div className="flex items-center gap-1">
          <span className="flex size-7 items-center justify-center rounded-md text-slate-400">
            ‹
          </span>
          <span className="flex size-7 items-center justify-center rounded-md bg-sky-500 text-xs font-semibold text-white">
            1
          </span>
          <span className="flex size-7 items-center justify-center rounded-md text-xs text-slate-500">
            2
          </span>
          <span className="flex size-7 items-center justify-center rounded-md text-slate-400">
            ›
          </span>
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
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-violet-50 text-violet-600",
    red: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-500",
    sky: "bg-sky-50 text-sky-600",
    teal: "bg-teal-50 text-teal-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
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
      className={`flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 ${className ?? ""}`}
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
    <IconButton
      label="Delete"
      onClick={onClick}
      className="bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
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
    </IconButton>
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
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          name="search"
          type="search"
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-300"
        />
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
    <select
      name={name}
      defaultValue="All"
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-300"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
