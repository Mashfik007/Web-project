import ActivityHeatmap from "@/Components/user.ActivityHeatmap";
import Badges from "@/Components/user.Badges";
import BooksPerMonth from "@/Components/user.BooksPerMonth";
import Intro from "@/Components/user.Intro";
import ReadingTabs from "@/Components/user.ReadingTabs";
import RecentActivity from "@/Components/user.RecentActivity";
import Streak from "@/Components/user.Streak";

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-slate-50 p-4 md:p-6">
      <Intro />
      <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left Section */}
        <div className="space-y-4">
          <ReadingTabs />
          <RecentActivity />
        </div>

        {/* Right Section */}
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
