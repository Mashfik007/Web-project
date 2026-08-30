import Image from "next/image";
import bookIcon from "@svg/book.svg";
import refreshIcon from "@svg/refresh.svg";
import usersIcon from "@svg/users.svg";
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
  if (id === "total-books") {
    return (
      <Image
        src={bookIcon}
        alt="Book"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  if (id === "active-members") {
    return (
      <Image
        src={usersIcon}
        alt="Users"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  return (
    <Image
      src={refreshIcon}
      alt="Refresh"
      width={16}
      height={16}
      className="size-4"
    />
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
