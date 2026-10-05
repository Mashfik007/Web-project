"use client";

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
    </article>
  );
}
