"use client";

import Image from "next/image";
import type { CategoryStat } from "@/types/myShelf";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryBreakdownProps {
  categories: CategoryStat[];
}

export default function CategoryBreakdown({
  categories,
}: CategoryBreakdownProps) {
  const data = categories.map((item) => ({
    ...item,
    detail: `${item.count} books · ${item.percentage}%`,
  }));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Image
            src="/svg/tag.svg"
            alt="Category"
            width={16}
            height={16}
            className="size-4"
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Category Breakdown
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
              dataKey="category"
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
