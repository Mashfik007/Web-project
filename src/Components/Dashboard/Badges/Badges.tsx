import Image from "next/image";
import type { ReactNode } from "react";
import type { DashboardBadge, DashboardBadgeIcon } from "@/types/dashboard";

const icons: Record<DashboardBadgeIcon, ReactNode> = {
  book: (
    <Image src="/svg/open-book.svg" alt="" width={20} height={20} className="size-5" />
  ),
  streak: "♨",
  hours: "☆",
  friends: "♧",
  speed: "◷",
  century: "♜",
};

interface BadgesProps {
  badges: DashboardBadge[];
}

export default function Badges({ badges }: BadgesProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-slate-700">Badges</h2>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {badges.map((badge) => (
          <div
            key={badge.name}
            className={`flex min-h-27 flex-col items-center justify-center rounded-xl border p-2 text-center ${
              badge.active
                ? "border-sky-200 bg-sky-50/40"
                : "border-slate-100 bg-slate-50 opacity-40"
            }`}
          >
            <div
              className={`flex size-10 items-center justify-center rounded-full text-lg ${
                badge.active ? "bg-sky-100 text-sky-600" : "bg-slate-200 text-slate-400"
              }`}
            >
              {icons[badge.icon]}
            </div>

            <h3 className="mt-2 text-[10px] font-bold text-slate-600">{badge.name}</h3>
            <p className="mt-1 text-[8px] text-slate-400">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
