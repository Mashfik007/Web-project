"use client";

import HeatmapChart from "@/Components/HeatmapChart/HeatmapChart";

const legendColors = ["#F0F9FF", "#E0F2FE", "#7DD3FC", "#0284C7"];

interface ActivityHeatmapProps {
  activity: number[];
}

export default function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-slate-700">Activity</h2>
        <span className="text-[10px] text-slate-400">12 weeks</span>
      </div>

      <div className="mt-4 h-32 w-full">
        <HeatmapChart activity={activity} weeks={12} days={7} flow="column" />
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>Less</span>
        {legendColors.map((color) => (
          <div key={color} className="size-3 rounded-sm" style={{ backgroundColor: color }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
