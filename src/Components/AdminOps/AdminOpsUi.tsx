import type { ReactNode } from "react";

export function AdminFilterTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-sky-500 text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            {tab.count !== undefined ? ` (${tab.count})` : ""}
          </button>
        );
      })}
    </div>
  );
}

export function MemberCell({
  name,
  initials,
  avatarClass,
}: {
  name: string;
  initials: string;
  avatarClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold ${avatarClass}`}
      >
        {initials}
      </span>
      <span className="font-semibold text-slate-800">{name}</span>
    </div>
  );
}

export function BookCell({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4 text-sky-500"
      >
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
      {title}
    </div>
  );
}

export function TextAction({
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
    sky: "bg-sky-50 text-sky-600 hover:bg-sky-100",
    green: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    red: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    slate: "text-slate-500 hover:bg-slate-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${tones[tone]}`}
    >
      {icon}
      {label}
    </button>
  );
}

export function AdminCard({ children }: { children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
      {children}
    </section>
  );
}
