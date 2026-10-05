"use client";

import { useState } from "react";
import DetailsTab from "../DetailsTab/DetailsTab";
import ReviewsTab from "../ReviewsTab/ReviewsTab";
import type { BookDetails, BookReviewItem } from "@/types/bookDetails";

const TABS = ["Details", "Reviews", "Stats", "Related Books"] as const;

type Tab = (typeof TABS)[number];

interface BookTabsProps {
  metadata: BookDetails["metadata"];
  availability: BookDetails["availability"];
  reviews: BookReviewItem[];
}

export default function BookTabs({
  metadata,
  availability,
  reviews,
}: BookTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Details");

  return (
    <section className="card bg-base-100 p-6 shadow-sm">
      <div role="tablist" className="tabs tabs-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            onClick={() => setActiveTab(tab)}
            className={`tab ${activeTab === tab ? "tab-active" : ""}`}
          >
            {tab}
            {tab === "Reviews" && reviews.length > 0
              ? ` (${reviews.length})`
              : ""}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "Details" && (
          <DetailsTab metadata={metadata} availability={availability} />
        )}
        {activeTab === "Reviews" && <ReviewsTab reviews={reviews} />}
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
