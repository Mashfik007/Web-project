import Image from "next/image";
const badges = [
  {
    name: "Bookworm",
    description: "Read 20+ books",
    active: true,
    icon: (
      <Image
        src="/svg/open-book.svg"
        alt="Books"
        width={20}
        height={20}
        className="size-5"
      />
    ),
  },
  {
    name: "Streak Master",
    description: "14-day streak",
    active: true,
    icon: "♨",
  },
  {
    name: "Critic",
    description: "Write 10 reviews",
    active: true,
    icon: "☆",
  },
  {
    name: "Social Butterfly",
    description: "Join 3 clubs",
    active: false,
    icon: "♧",
  },
  {
    name: "Speed Reader",
    description: "Finish in <2 days",
    active: false,
    icon: "◷",
  },
  {
    name: "Century Club",
    description: "Read 100 books",
    active: false,
    icon: "♜",
  },
];

export default function Badges() {
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
                badge.active
                  ? "bg-sky-100 text-sky-600"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {badge.icon}
            </div>

            <h3 className="mt-2 text-[10px] font-bold text-slate-600">
              {badge.name}
            </h3>

            <p className="mt-1 text-[8px] text-slate-400">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
