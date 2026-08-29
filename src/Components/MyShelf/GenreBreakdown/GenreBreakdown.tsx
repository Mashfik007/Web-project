"use client";

import type { GenreStat } from "@/types/myShelf";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GenreBreakdownProps {
  genres: GenreStat[];
}

export default function GenreBreakdown({ genres }: GenreBreakdownProps) {
  const data = genres.map((genre) => ({
    ...genre,
    detail: `${genre.count} books · ${genre.percentage}%`,
  }));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Genre Breakdown
        </h3>
      </div>

      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 4, right: 96, left: 4, bottom: 4 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="genre"
              width={78}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#334155" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(14, 165, 233, 0.06)" }}
              formatter={(value) => [`${value}%`, "Share"]}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="percentage"
              fill="#0EA5E9"
              barSize={10}
              radius={[0, 8, 8, 0]}
              background={{ fill: "#F1F5F9", radius: 8 }}
            >
              <LabelList
                dataKey="detail"
                position="right"
                fill="#94A3B8"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
