"use client";

import { useState } from "react";
import type { DashboardReading } from "@/types/dashboard";

interface ReadingTabsProps {
  reading: DashboardReading;
}

export default function ReadingTabs({ reading }: ReadingTabsProps) {
  const tabs = [
    { name: "Currently Reading", count: reading.counts.reading },
    { name: "Completed", count: reading.counts.completed },
    { name: "Want to Read", count: reading.counts.want },
    { name: "History", count: reading.counts.history },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const current = reading.current;

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
            <span className="badge badge-soft badge-info badge-xs ml-2">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === "Completed" && reading.completed.length > 0 ? (
          <ul className="space-y-3">
            {reading.completed.map((book) => (
              <li
                key={book.title}
                className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-slate-50/80 p-3"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-14 w-10 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {book.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">{book.author}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : activeTab === "Currently Reading" && current ? (
          <div className="flex gap-4 rounded-2xl border border-sky-100 bg-slate-50/80 p-4">
            <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-300">
              <img
                src={current.coverImage}
                alt={current.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-700">{current.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{current.author}</p>
              <div className="mt-3 flex items-center gap-2">
                <progress
                  className="progress progress-primary flex-1"
                  value={current.progress}
                  max={100}
                />
                <span className="text-primary text-xs font-medium">
                  {current.progress}%
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{current.detail}</p>
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            {activeTab === "Currently Reading"
              ? "No book is checked out right now."
              : `${tabs.find((tab) => tab.name === activeTab)?.count ?? 0} in ${activeTab}. Open My Shelf for the full list.`}
          </p>
        )}
      </div>
    </div>
  );
}
