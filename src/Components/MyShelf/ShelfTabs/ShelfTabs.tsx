"use client";

import { useState } from "react";
import ReadingBookCard from "../ReadingBookCard/ReadingBookCard";
import type { MyShelfData, ShelfTab } from "@/types/myShelf";

interface ShelfTabsProps {
  tabs: ShelfTab[];
  currentlyReading: MyShelfData["currentlyReading"];
  completed: MyShelfData["completed"];
  wantToRead: MyShelfData["wantToRead"];
  borrowedHistory: MyShelfData["borrowedHistory"];
}

export default function ShelfTabs({
  tabs,
  currentlyReading,
  completed,
  wantToRead,
  borrowedHistory,
}: ShelfTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "currently-reading");

  const booksByTab: Record<string, MyShelfData["currentlyReading"]> = {
    "currently-reading": currentlyReading,
    completed,
    "want-to-read": wantToRead,
    "borrowed-history": borrowedHistory,
  };

  const activeBooks = booksByTab[activeTab] ?? [];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex overflow-x-auto border-b border-slate-200 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative shrink-0 px-4 py-4 text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? "text-sky-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-sky-500" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-5">
        {activeBooks.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No books in this section yet.
          </p>
        ) : (
          activeBooks.map((book) => (
            <ReadingBookCard
              key={book.id}
              book={book}
              variant={activeTab === "currently-reading" ? "reading" : "simple"}
            />
          ))
        )}
      </div>
    </section>
  );
}
