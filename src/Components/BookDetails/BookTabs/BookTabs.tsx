"use client";

import { useState } from "react";
import DetailsTab from "../DetailsTab/DetailsTab";
import type { BookDetails } from "@/types/bookDetails";

const TABS = ["Details", "Reviews", "Stats", "Related Books"] as const;

type Tab = (typeof TABS)[number];

interface BookTabsProps {
  metadata: BookDetails["metadata"];
}

export default function BookTabs({ metadata }: BookTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Details");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-6 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-sky-500 text-sky-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "Details" && <DetailsTab metadata={metadata} />}
        {activeTab === "Reviews" && (
          <p className="py-8 text-center text-sm text-slate-500">
            Reviews coming soon.
          </p>
        )}
        {activeTab === "Stats" && (
          <p className="py-8 text-center text-sm text-slate-500">
            Reading stats coming soon.
          </p>
        )}
        {activeTab === "Related Books" && (
          <p className="py-8 text-center text-sm text-slate-500">
            Related books coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
