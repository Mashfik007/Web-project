import type { DashboardStreak } from "@/types/dashboard";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

interface StreakProps {
  streak: DashboardStreak;
}

export default function Streak({ streak }: StreakProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-slate-700">Streak</h2>

        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5">
          <span className="text-amber-500">♨</span>
          <span className="text-lg font-bold text-slate-700">{streak.current}</span>
          <span className="text-xs text-slate-500">days</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[9px] font-medium text-slate-400">
        {weekdays.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {streak.days.map((day) =>
          day.state === "pad" ? (
            <div key={day.key} />
          ) : (
            <div
              key={day.key}
              className={`flex aspect-square items-center justify-center rounded-lg text-[10px] font-medium ${
                day.state === "read"
                  ? "bg-sky-600 text-white"
                  : day.state === "ahead"
                    ? "bg-slate-50 text-slate-300"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {day.label}
            </div>
          ),
        )}
      </div>

      <div className="mt-5 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <i className="size-2 rounded bg-sky-600" />
            Read
          </span>
          <span className="flex items-center gap-1">
            <i className="size-2 rounded bg-slate-100" />
            Missed
          </span>
        </div>
        <span className="font-medium text-sky-700">Best: {streak.best} days</span>
      </div>
    </div>
  );
}
