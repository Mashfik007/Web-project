"use client";

import { useState } from "react";
import type { BorrowingHabits } from "@/types/forYou";

interface BorrowingHabitsCardProps {
  habits: BorrowingHabits;
}

function DonutChart({
  genres,
  totalBooks,
}: {
  genres: BorrowingHabits["genres"];
  totalBooks: number;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="14"
        />
        {genres.map((genre) => {
          const segment = (genre.percentage / 100) * circumference;
          const currentOffset = offset;
          offset += segment;

          return (
            <circle
              key={genre.genre}
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={genre.color}
              strokeWidth="14"
              strokeDasharray={`${segment} ${circumference - segment}`}
              strokeDashoffset={-currentOffset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
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
        {habits.totalBooks} books · {habits.months} months · {habits.genreCount}{" "}
        genres
      </p>

      <div className="mt-5 flex items-center gap-5">
        <DonutChart genres={habits.genres} totalBooks={habits.totalBooks} />

        <ul className="min-w-0 flex-1 space-y-2">
          {habits.genres.map((genre) => (
            <li
              key={genre.genre}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: genre.color }}
                />
                <span className="truncate font-medium text-slate-700">
                  {genre.genre}
                </span>
              </div>
              <span className="shrink-0 text-slate-400">
                {genre.count} books · {genre.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-700">
            Genre Blend Slider
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
