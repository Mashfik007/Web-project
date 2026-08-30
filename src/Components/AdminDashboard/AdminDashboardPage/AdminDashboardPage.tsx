import BooksByGenreChart from "@/Components/AdminDashboard/BooksByGenreChart/BooksByGenreChart";
import MonthlyBorrowChart from "@/Components/AdminDashboard/MonthlyBorrowChart/MonthlyBorrowChart";
import RecentActivity from "@/Components/AdminDashboard/RecentActivity/RecentActivity";
import StatCards from "@/Components/AdminDashboard/StatCards/StatCards";
import UserActivityChart from "@/Components/AdminDashboard/UserActivityChart/UserActivityChart";
import type { AdminDashboardData } from "@/types/adminDashboard";

interface AdminDashboardPageProps {
  dashboard: AdminDashboardData;
}

export default function AdminDashboardPage({
  dashboard,
}: AdminDashboardPageProps) {
  return (
    <main className="bg-base-200 min-h-full p-5 md:p-7 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {dashboard.adminName}. Here&apos;s what&apos;s happening
          today.
        </p>
      </header>

      <StatCards stats={dashboard.stats} />

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyBorrowChart
            data={dashboard.monthlyBorrows}
            yearLabel={dashboard.borrowYearLabel}
          />
        </div>
        <UserActivityChart
          data={dashboard.userActivity}
          total={dashboard.userActivityTotal}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BooksByGenreChart data={dashboard.booksByGenre} />
        </div>
        <RecentActivity items={dashboard.recentActivity} />
      </div>
    </main>
  );
}
