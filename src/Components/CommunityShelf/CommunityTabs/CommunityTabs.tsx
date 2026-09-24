"use client";

import { useState } from "react";
import MemberCard from "../MemberCard/MemberCard";
import type { CommunityMember, CommunityTab } from "@/types/communityShelf";

interface CommunityTabsProps {
  viewerId: string;
  tabs: CommunityTab[];
  members: CommunityMember[];
}

export default function CommunityTabs({ viewerId, tabs, members }: CommunityTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const visible =
    activeTab === "friends"
      ? members.filter((member) => member.isFriend)
      : activeTab === "popular"
        ? [...members].sort((a, b) => b.booksBorrowed - a.booksBorrowed)
        : members;

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
        {visible.length === 0 ? (
          <p className="text-sm text-slate-500">No readers in this list yet.</p>
        ) : (
          visible.map((member) => (
            <MemberCard key={member.id} viewerId={viewerId} member={member} />
          ))
        )}
      </div>
    </section>
  );
}
