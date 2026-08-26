const badges = [
  {
    name: "Bookworm",
    description: "Read 20+ books",
    active: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="size-5"
      >
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21z" />
      </svg>
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
