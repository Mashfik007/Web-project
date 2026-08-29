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
    <div className="flex flex-wrap gap-2 border-b border-base-200 p-4">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`}
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
      <div className="avatar avatar-placeholder">
        <div
          className={`w-9 rounded-full text-xs font-semibold ${avatarClass}`}
        >
          <span>{initials}</span>
        </div>
      </div>
      <span className="font-semibold">{name}</span>
    </div>
  );
}

export function BookCell({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4 text-primary"
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

export function AdminCard({ children }: { children: ReactNode }) {
  return <section className="card bg-base-100 shadow-sm">{children}</section>;
}
