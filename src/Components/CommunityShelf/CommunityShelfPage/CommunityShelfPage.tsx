import BorrowRequests from "../BorrowRequests/BorrowRequests";
import CommunityHeader from "../CommunityHeader/CommunityHeader";
import CommunityTabs from "../CommunityTabs/CommunityTabs";
import NetworkStats from "../NetworkStats/NetworkStats";
import ReadingFeed from "../ReadingFeed/ReadingFeed";
import type { CommunityShelfData } from "@/types/communityShelf";

interface CommunityShelfPageProps {
  community: CommunityShelfData;
}

export default function CommunityShelfPage({
  community,
}: CommunityShelfPageProps) {
  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <CommunityHeader header={community.header} />
        <NetworkStats stats={community.stats} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <CommunityTabs tabs={community.tabs} members={community.members} />
            <BorrowRequests
              requests={community.borrowRequests}
              activeCount={community.activeRequestCount}
            />
          </div>

          <ReadingFeed items={community.readingFeed} />
        </div>
      </div>
    </main>
  );
}
