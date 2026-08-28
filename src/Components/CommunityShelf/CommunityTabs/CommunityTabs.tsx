"use client";

import { useState } from "react";
import MemberCard from "../MemberCard/MemberCard";
import type { CommunityMember, CommunityTab } from "@/types/communityShelf";

interface CommunityTabsProps {
  tabs: CommunityTab[];
  members: CommunityMember[];
}

export default function CommunityTabs({ tabs, members }: CommunityTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[1]?.id ?? tabs[0]?.id ?? "");

  return (
    <section>
      <div className="flex overflow-x-auto border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? "text-sky-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-sky-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
