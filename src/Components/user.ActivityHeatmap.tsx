"use client";

import HeatmapChart from "@/Components/user.HeatmapChart";

const activity = [
  0, 1, 0, 2, 1, 0, 1, 2, 1, 3, 0, 1, 1, 2, 3, 1, 0, 1, 2, 3, 2, 0, 1, 3, 3, 1,
  2, 3, 2, 1, 0, 2, 3, 1, 2, 3, 1, 2, 0, 1, 3, 2, 1, 3, 0, 2, 3, 1, 0, 1, 2, 3,
  1, 2, 3, 1, 0, 2, 1, 3, 1, 0, 2, 1, 3, 2, 1, 3, 0, 1, 2, 3,
];

const legendColors = ["#F0F9FF", "#E0F2FE", "#7DD3FC", "#0284C7"];

export default function ActivityHeatmap() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-slate-700">
          Activity
        </h2>

        <span className="text-[10px] text-slate-400">12 weeks</span>
      </div>

      <div className="mt-4 h-28 w-full">
        <HeatmapChart activity={activity} weeks={12} days={6} flow="row" />
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
    </div>
  );
}
