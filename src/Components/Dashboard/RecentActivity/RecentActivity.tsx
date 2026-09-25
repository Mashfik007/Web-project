import type { DashboardActivityItem } from "@/types/dashboard";

interface RecentActivityProps {
  items: DashboardActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-slate-700">Recent Activity</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No activity yet. Borrow a book or log an hour of reading.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="pt-1.5">
                <div className={`size-2 rounded-full ${activity.color}`} />
              </div>

              <div>
                <p className="text-sm text-slate-600">
                  {activity.action} <b>{activity.subject}</b>
                  {activity.suffix ? ` ${activity.suffix}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
