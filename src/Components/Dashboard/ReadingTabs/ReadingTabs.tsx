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
    <div className="card bg-base-100 shadow-sm">
      {/* Tabs */}
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
              <progress
                className="progress progress-primary flex-1"
                value={62}
                max={100}
              />
              <span className="text-primary text-xs font-medium">62%</span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              109p left · due Aug 12
            </p>

            <div className="mt-3 flex gap-2">
              <button type="button" className="btn btn-ghost btn-xs">
                ↻ Renew
              </button>

              <button type="button" className="btn btn-ghost btn-xs">
                ↶ Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
