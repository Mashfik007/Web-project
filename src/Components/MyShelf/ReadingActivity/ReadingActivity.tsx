const activityColors = ["bg-sky-50", "bg-sky-100", "bg-sky-300", "bg-sky-600"];

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

interface ReadingActivityProps {
  activity: number[];
  streakDays: number;
}

export default function ReadingActivity({
  activity,
  streakDays,
}: ReadingActivityProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Reading Activity
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">Last 12 weeks</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
          🔥 {streakDays} streak
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex flex-col gap-1 pt-0.5 text-[9px] text-slate-400">
          {dayLabels.map((day, index) => (
            <span key={index} className="flex h-3 items-center">
              {day}
            </span>
          ))}
        </div>

        <div className="grid flex-1 grid-flow-col grid-rows-7 gap-1">
          {activity.map((level, index) => (
            <div
              key={index}
              className={`aspect-square rounded-sm ${activityColors[level] ?? activityColors[0]}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>Less</span>
        {activityColors.map((color, index) => (
          <div key={index} className={`size-3 rounded-sm ${color}`} />
        ))}
        <span>More</span>
      </div>
    </article>
  );
}
