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
      <div role="tablist" className="tabs tabs-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
          >
            {tab.label}
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
