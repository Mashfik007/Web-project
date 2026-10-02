"use client";

import { useState } from "react";
import type { BorrowingHabits } from "@/types/forYou";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface BorrowingHabitsCardProps {
  habits: BorrowingHabits;
}

function DonutChart({
  categories,
  totalBooks,
}: {
  categories: BorrowingHabits["categories"];
  totalBooks: number;
}) {
  return (
    <div className="relative size-36 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categories}
            dataKey="percentage"
            nameKey="category"
            innerRadius={42}
            outerRadius={56}
            paddingAngle={2}
            stroke="none"
          >
            {categories.map((item) => (
              <Cell key={item.category} fill={item.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, "Share"]}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{totalBooks}</span>
        <span className="text-xs text-slate-400">books</span>
      </div>
    </div>
  );
}

export default function BorrowingHabitsCard({
  habits,
}: BorrowingHabitsCardProps) {
  const [blendValue, setBlendValue] = useState(habits.blendSlider.value);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">
        Your Borrowing Habits
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">
        {habits.totalBooks} books · {habits.months} months ·{" "}
        {habits.categoryCount} categories
      </p>

      <div className="mt-5 flex items-center gap-5">
        <DonutChart
          categories={habits.categories}
          totalBooks={habits.totalBooks}
        />

        <ul className="min-w-0 flex-1 space-y-2">
          {habits.categories.map((item) => (
            <li
              key={item.category}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate font-medium text-slate-700">
                  {item.category}
                </span>
              </div>
              <span className="shrink-0 text-slate-400">
                {item.count} books · {item.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-700">
            Category Blend Slider
          </p>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
            {habits.blendSlider.balanceLabel}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-[10px] font-medium text-slate-500">
            {habits.blendSlider.leftLabel}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={blendValue}
            onChange={(event) => setBlendValue(Number(event.target.value))}
            className="range range-xs range-primary flex-1"
          />
          <span className="text-[10px] font-medium text-slate-500">
            {habits.blendSlider.rightLabel}
          </span>
        </div>

        <p className="mt-2 text-[10px] text-slate-400">
          {habits.blendSlider.hint}
        </p>
      </div>
    </article>
  );
}
