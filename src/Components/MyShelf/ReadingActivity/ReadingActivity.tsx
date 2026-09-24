"use client";

import HeatmapChart from "@/Components/HeatmapChart/HeatmapChart";

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
const legendColors = ["#F0F9FF", "#E0F2FE", "#7DD3FC", "#0284C7"];

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
          <p className="mt-0.5 text-xs text-slate-500">
            Last 12 weeks · each mark is 1 hour
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
          🔥 {streakDays} streak
        </span>
      </div>

      <div className="mt-4 h-36 w-full">
        <HeatmapChart
          activity={activity}
          weeks={12}
          days={7}
          flow="column"
          dayLabels={dayLabels}
        />
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>Less</span>
        {legendColors.map((color) => (
          <div
            key={color}
            className="size-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
    </article>
  );
}
