import Image from "next/image";
import bookIcon from "@svg/book.svg";
import bookOpenIcon from "@svg/book-open.svg";
import flameIcon from "@svg/flame.svg";
import heartIcon from "@svg/heart.svg";
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

function StatIcon({ id }: { id: string }) {
  if (id === "books-read") {
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

  if (id === "currently-reading") {
    return (
      <Image
        src={bookOpenIcon}
        alt="Reading"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  if (id === "want-to-read") {
    return (
      <Image
        src={heartIcon}
        alt="Favorite"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  return (
    <Image
      src={flameIcon}
      alt="Streak"
      width={16}
      height={16}
      className="size-4"
    />
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
              <StatIcon id={stat.id} />
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
