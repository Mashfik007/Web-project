"use client";

import { useState } from "react";
import ReadingBookCard from "../ReadingBookCard/ReadingBookCard";
import type { MyShelfData, ShelfTab } from "@/types/myShelf";

interface ShelfTabsProps {
  userId: string;
  tabs: ShelfTab[];
  currentlyReading: MyShelfData["currentlyReading"];
  completed: MyShelfData["completed"];
  wantToRead: MyShelfData["wantToRead"];
  borrowedHistory: MyShelfData["borrowedHistory"];
}

export default function ShelfTabs({
  userId,
  tabs,
  currentlyReading,
  completed,
  wantToRead,
  borrowedHistory,
}: ShelfTabsProps) {
  const [activeTab, setActiveTab] = useState(
    tabs[0]?.id ?? "currently-reading",
  );

  const booksByTab: Record<string, MyShelfData["currentlyReading"]> = {
    "currently-reading": currentlyReading,
    completed,
    "want-to-read": wantToRead,
    "borrowed-history": borrowedHistory,
  };

  const activeBooks = booksByTab[activeTab] ?? [];

  return (
    <section className="card bg-base-100 shadow-sm">
      <div role="tablist" className="tabs tabs-border px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
          >
            {tab.label}
            <span className="badge badge-soft badge-info badge-xs ml-2">
              {tab.count}
            </span>
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
              userId={userId}
              book={book}
              variant={activeTab === "currently-reading" ? "reading" : "simple"}
            />
          ))
        )}
      </div>
    </section>
  );
}
