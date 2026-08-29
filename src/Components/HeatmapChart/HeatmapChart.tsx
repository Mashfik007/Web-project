"use client";

import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  usePlotArea,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#F0F9FF", "#E0F2FE", "#7DD3FC", "#0284C7"];

export type HeatPoint = {
  week: number;
  day: number;
  value: number;
};

export function toHeatmapPoints(
  activity: number[],
  options: { weeks: number; days: number; flow: "row" | "column" },
): HeatPoint[] {
  const { weeks, days, flow } = options;

  return activity.map((value, index) =>
    flow === "column"
      ? { week: Math.floor(index / days), day: index % days, value }
      : { week: index % weeks, day: Math.floor(index / weeks), value },
  );
}

function HeatCell({
  cx = 0,
  cy = 0,
  payload,
  weeks,
  days,
}: {
  cx?: number;
  cy?: number;
  payload?: HeatPoint;
  weeks: number;
  days: number;
}) {
  const plot = usePlotArea();
  const width = Math.max(8, (plot?.width ?? 12 * weeks) / weeks - 3);
  const height = Math.max(8, (plot?.height ?? 12 * days) / days - 3);

  return (
    <rect
      x={cx - width / 2}
      y={cy - height / 2}
      width={width}
      height={height}
      rx={2}
      fill={COLORS[payload?.value ?? 0] ?? COLORS[0]}
    />
  );
}

interface HeatmapChartProps {
  activity: number[];
  weeks: number;
  days: number;
  flow: "row" | "column";
  dayLabels?: string[];
}

export default function HeatmapChart({
  activity,
  weeks,
  days,
  flow,
  dayLabels,
}: HeatmapChartProps) {
  const data = toHeatmapPoints(activity, { weeks, days, flow });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 8, right: 4, left: dayLabels ? 4 : 0, bottom: 4 }}
      >
        <XAxis
          type="number"
          dataKey="week"
          domain={[-0.5, weeks - 0.5]}
          tick={false}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="day"
          domain={[-0.5, days - 0.5]}
          reversed
          ticks={dayLabels?.map((_, index) => index)}
          tickFormatter={
            dayLabels ? (value: number) => dayLabels[value] ?? "" : undefined
          }
          tick={dayLabels ? { fontSize: 9, fill: "#94A3B8" } : false}
          axisLine={false}
          tickLine={false}
          width={dayLabels ? 16 : 0}
        />
        <Tooltip
          cursor={{ stroke: "transparent" }}
          content={({ payload }) => {
            const point = payload?.[0]?.payload as HeatPoint | undefined;
            if (!point) return null;

            return (
              <div className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 shadow-sm">
                Week {point.week + 1}: {point.value} reads
              </div>
            );
          }}
        />
        <Scatter
          data={data}
          shape={(props) => <HeatCell {...props} weeks={weeks} days={days} />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
