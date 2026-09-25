"use client";

import { useState } from "react";
import type { DashboardBook, DashboardReading } from "@/types/dashboard";

interface ReadingTabsProps {
  reading: DashboardReading;
}

function BookRow({ book }: { book: DashboardBook }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <img
        src={book.coverImage}
        alt={book.title}
        className="h-14 w-10 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{book.title}</p>
        <p className="truncate text-xs text-slate-500">{book.author}</p>
        {typeof book.progress === "number" ? (
          <div className="mt-2 flex items-center gap-2">
            <progress
              className="progress progress-primary flex-1"
              value={book.progress}
              max={100}
            />
            <span className="text-primary text-xs font-medium">{book.progress}%</span>
          </div>
        ) : null}
        {book.detail ? <p className="mt-1 text-xs text-slate-500">{book.detail}</p> : null}
      </div>
    </li>
  );
}

export default function ReadingTabs({ reading }: ReadingTabsProps) {
  const tabs = [
    { name: "Currently Reading", count: reading.counts.reading, books: reading.currentlyReading },
    { name: "Completed", count: reading.counts.completed, books: reading.completed },
    { name: "Want to Read", count: reading.counts.want, books: reading.wantToRead },
    { name: "History", count: reading.counts.history, books: reading.history },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const selected = tabs.find((tab) => tab.name === activeTab) ?? tabs[0];

  return (
    <div className="card bg-base-100 shadow-sm">
      <div role="tablist" className="tabs tabs-border">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            type="button"
            role="tab"
            onClick={() => setActiveTab(tab.name)}
            className={`tab ${activeTab === tab.name ? "tab-active" : ""}`}
          >
            {tab.name}
            <span className="badge badge-soft badge-info badge-xs ml-2">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="p-5">
        {selected.books.length > 0 ? (
          <ul className="space-y-3">
            {selected.books.map((book) => (
              <BookRow key={book.id} book={book} />
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            Nothing in {selected.name} yet.
          </p>
        )}
      </div>
    </div>
  );
}
