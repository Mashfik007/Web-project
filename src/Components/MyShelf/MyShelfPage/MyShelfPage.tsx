import DueDates from "../DueDates/DueDates";
import GenreBreakdown from "../GenreBreakdown/GenreBreakdown";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ReadingActivity from "../ReadingActivity/ReadingActivity";
import ShelfTabs from "../ShelfTabs/ShelfTabs";
import StatsCards from "../StatsCards/StatsCards";
import type { MyShelfData } from "@/types/myShelf";

interface MyShelfPageProps {
  shelf: MyShelfData;
}

export default function MyShelfPage({ shelf }: MyShelfPageProps) {
  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-5">
        <ProfileHeader user={shelf.user} />
        <StatsCards stats={shelf.stats} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <ShelfTabs
            tabs={shelf.tabs}
            currentlyReading={shelf.currentlyReading}
            completed={shelf.completed}
            wantToRead={shelf.wantToRead}
            borrowedHistory={shelf.borrowedHistory}
          />

          <aside className="space-y-5">
            <ReadingActivity
              activity={shelf.activity}
              streakDays={shelf.user.streakDays}
            />
            <DueDates dueDates={shelf.dueDates} />
            <GenreBreakdown genres={shelf.genres} />
          </aside>
        </div>
      </div>
    </main>
  );
}
