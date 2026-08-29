import type { AdminActivityItem } from "@/types/adminDashboard";

interface RecentActivityProps {
  items: AdminActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <article className="card bg-base-100 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">Recent Activity</h2>

      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${item.avatarClass}`}
            >
              {item.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {item.name}
                </p>
                <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{item.action}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
