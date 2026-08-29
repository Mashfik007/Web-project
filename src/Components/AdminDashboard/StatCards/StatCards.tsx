import type { AdminStat } from "@/types/adminDashboard";

interface StatCardsProps {
  stats: AdminStat[];
}

const iconWrap: Record<AdminStat["id"], string> = {
  "total-books": "bg-blue-50 text-blue-500",
  "active-users": "bg-violet-50 text-violet-500",
  "borrows-today": "bg-emerald-50 text-emerald-500",
  overdue: "bg-red-50 text-red-500",
  "fines-due": "bg-amber-50 text-amber-500",
  reservations: "bg-cyan-50 text-cyan-500",
};

function StatIcon({ id }: { id: AdminStat["id"] }) {
  const className = "size-4";

  if (id === "total-books") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    );
  }

  if (id === "active-users") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (id === "borrows-today") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
      </svg>
    );
  }

  if (id === "overdue") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (id === "fines-due") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 10h16" />
        <path d="M12 4v16" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function Trend({ trend }: { trend: AdminStat["trend"] }) {
  const color =
    trend.tone === "positive" ? "text-emerald-500" : "text-red-500";
  const prefix = trend.direction === "up" ? "+" : "-";

  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${color}`}>
      {trend.direction === "up" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
        >
          <path d="M7 17 17 7" />
          <path d="M7 7h10v10" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
        >
          <path d="M7 7 17 17" />
          <path d="M17 7v10H7" />
        </svg>
      )}
      {prefix}
      {trend.value}%
    </span>
  );
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <article
          key={stat.id}
          className="card bg-base-100 p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <span
              className={`flex size-9 items-center justify-center rounded-lg ${iconWrap[stat.id]}`}
            >
              <StatIcon id={stat.id} />
            </span>
            <Trend trend={stat.trend} />
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-800">
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
        </article>
      ))}
    </div>
  );
}
