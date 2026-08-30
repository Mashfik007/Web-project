"use client";

import type { GenreCount } from "@/types/adminDashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BooksByGenreChartProps {
  data: GenreCount[];
}

export default function BooksByGenreChart({ data }: BooksByGenreChartProps) {
  return (
    <article className="card bg-base-100 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">Books by Genre</h2>
      <p className="mt-0.5 text-xs text-slate-400">
        Collection distribution across categories
      </p>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E5E7EB"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="genre"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
            />
            <YAxis
              domain={[0, 1000]}
              ticks={[0, 250, 500, 750, 1000]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="count"
              fill="#60A5FA"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
