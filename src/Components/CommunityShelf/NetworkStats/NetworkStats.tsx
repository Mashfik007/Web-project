import type { NetworkStat } from "@/types/communityShelf";

interface NetworkStatsProps {
  stats: NetworkStat[];
}

const themeStyles = {
  blue: {
    card: "border-sky-100 bg-sky-50/60",
    icon: "bg-sky-100 text-sky-600",
    value: "text-sky-700",
  },
  purple: {
    card: "border-violet-100 bg-violet-50/60",
    icon: "bg-violet-100 text-violet-600",
    value: "text-violet-700",
  },
  green: {
    card: "border-emerald-100 bg-emerald-50/60",
    icon: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-700",
  },
};

function StatIcon({ id }: { id: string }) {
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

  if (id === "active-members") {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export default function NetworkStats({ stats }: NetworkStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const styles = themeStyles[stat.theme];

        return (
          <article
            key={stat.id}
            className={`rounded-2xl border p-4 shadow-sm ${styles.card}`}
          >
            <div
              className={`flex size-9 items-center justify-center rounded-xl ${styles.icon}`}
            >
              <StatIcon id={stat.id} />
            </div>
            <p className={`mt-3 text-2xl font-bold ${styles.value}`}>
              {stat.value.toLocaleString()}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-600">
              {stat.label}
            </p>
          </article>
        );
      })}
    </div>
  );
}
