"use client";

import { useState } from "react";

const tabs = [
  { name: "Currently Reading", count: 1 },
  { name: "Completed", count: 4 },
  { name: "Want to Read", count: 3 },
  { name: "History", count: 4 },
];

export default function ReadingTabs() {
  const [activeTab, setActiveTab] = useState("Currently Reading");

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`relative px-4 py-4 text-xs font-medium whitespace-nowrap transition ${
              activeTab === tab.name
                ? "text-sky-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.name}

            <span className="ml-2 rounded bg-sky-100 px-1.5 py-0.5 text-[10px]">
              {tab.count}
            </span>

            {activeTab === tab.name && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-500" />
            )}
          </button>
        ))}
      </div>

      {/* Current book */}
      <div className="p-5">
        <div className="flex gap-4 rounded-2xl border border-sky-100 bg-slate-50/80 p-4">
          {/* Book image */}
          <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-300">
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80"
              alt="The Midnight Library"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-700">
              The Midnight Library
            </h3>

            <p className="mt-1 text-xs text-slate-500">Matt Haig</p>

            {/* Progress */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-sky-100">
                <div className="h-full w-[62%] rounded-full bg-sky-600" />
              </div>

              <span className="text-xs font-medium text-sky-700">62%</span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              109p left · due Aug 12
            </p>

            <div className="mt-3 flex gap-2">
              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100">
                ↻ Renew
              </button>

              <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 transition hover:bg-slate-100">
                ↶ Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
