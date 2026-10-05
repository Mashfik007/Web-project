import Image from "next/image";
import type { AdminStat } from "@/types/adminDashboard";

interface StatCardsProps {
  stats: AdminStat[];
}

const iconWrap: Record<AdminStat["id"], string> = {
  "total-books": "bg-blue-50 text-blue-500",
  "active-users": "bg-violet-50 text-violet-500",
  "borrows-today": "bg-emerald-50 text-emerald-500",
  "purchases-today": "bg-amber-50 text-amber-500",
  "downloads-today": "bg-indigo-50 text-indigo-500",
  "fines-due": "bg-rose-50 text-rose-500",
};

function StatIcon({ id }: { id: AdminStat["id"] }) {
  if (id === "total-books") {
    return (
      <Image
        src="/svg/book.svg"
        alt="Book"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  if (id === "active-users") {
    return (
      <Image
        src="/svg/users.svg"
        alt="Users"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  if (id === "borrows-today") {
    return (
      <Image
        src="/svg/calendar-days.svg"
        alt="Borrows"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  if (id === "purchases-today") {
    return (
      <Image
        src="/svg/cart.svg"
        alt="Purchases"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  if (id === "downloads-today") {
    return (
      <Image
        src="/svg/shelf.svg"
        alt="Downloads"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  return (
    <Image
      src="/svg/target.svg"
      alt="Fines"
      width={16}
      height={16}
      className="size-4"
    />
  );
}

function Trend({ trend }: { trend: AdminStat["trend"] }) {
  const color = trend.tone === "positive" ? "text-emerald-500" : "text-red-500";
  const prefix = trend.direction === "up" ? "+" : "-";

  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-semibold ${color}`}
    >
      {trend.direction === "up" ? (
        <Image
          src="/svg/trend-up.svg"
          alt="Up"
          width={14}
          height={14}
          className="size-3.5"
        />
      ) : (
        <Image
          src="/svg/trend-down.svg"
          alt="Down"
          width={14}
          height={14}
          className="size-3.5"
        />
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
        <article key={stat.id} className="card bg-base-100 p-4 shadow-sm">
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
