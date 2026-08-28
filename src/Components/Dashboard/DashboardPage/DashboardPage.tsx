import ActivityHeatmap from "@/Components/user.ActivityHeatmap";
import Badges from "@/Components/user.Badges";
import BooksPerMonth from "@/Components/user.BooksPerMonth";
import Intro from "@/Components/user.Intro";
import ReadingTabs from "@/Components/user.ReadingTabs";
import RecentActivity from "@/Components/user.RecentActivity";
import Streak from "@/Components/user.Streak";
import type { DashboardData } from "@/types/dashboard";

interface DashboardPageProps {
  dashboard: DashboardData;
}

export default function DashboardPage({ dashboard }: DashboardPageProps) {
  return (
    <main className="min-h-screen w-full bg-slate-50 p-4 md:p-6">
      <Intro intro={dashboard.intro} />

      <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <ReadingTabs />
          <RecentActivity />
        </div>

        <aside className="space-y-4">
          <Streak />
          <BooksPerMonth />
          <Badges />
          <ActivityHeatmap />
        </aside>
      </div>
    </main>
  );
}
