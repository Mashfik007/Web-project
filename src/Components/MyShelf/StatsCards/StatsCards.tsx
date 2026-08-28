import type { ShelfStat } from "@/types/myShelf";

interface StatsCardsProps {
  stats: ShelfStat[];
}

const themeStyles = {
  blue: {
    card: "border-sky-100 bg-sky-50/50",
    icon: "bg-sky-100 text-sky-600",
    value: "text-sky-700",
  },
  purple: {
    card: "border-violet-100 bg-violet-50/50",
    icon: "bg-violet-100 text-violet-600",
    value: "text-violet-700",
  },
  pink: {
    card: "border-rose-100 bg-rose-50/50",
    icon: "bg-rose-100 text-rose-600",
    value: "text-rose-700",
  },
  amber: {
    card: "border-amber-100 bg-amber-50/50",
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-700",
  },
};

function StatIcon({ theme, id }: { theme: ShelfStat["theme"]; id: string }) {
  const className = "size-4";

  if (id === "books-read") {
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

  if (id === "currently-reading") {
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
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      </svg>
    );
  }

  if (id === "want-to-read") {
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
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
              <StatIcon theme={stat.theme} id={stat.id} />
            </div>

            <p className={`mt-3 text-3xl font-bold ${styles.value}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {stat.label}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{stat.subtitle}</p>
          </article>
        );
      })}
    </div>
  );
}
