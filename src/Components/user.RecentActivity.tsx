const activities = [
  {
    color: "bg-sky-500",
    text: (
      <>
        Borrowed <b>The Midnight Library</b>
      </>
    ),
    time: "2h ago",
  },
  {
    color: "bg-amber-400",
    text: (
      <>
        Rated <b>Klara and the Sun ★★★★★</b>
      </>
    ),
    time: "Yesterday",
  },
  {
    color: "bg-violet-500",
    text: (
      <>
        Joined <b>Sci-Fi Readers</b> group
      </>
    ),
    time: "2 days ago",
  },
  {
    color: "bg-emerald-500",
    text: (
      <>
        Returned <b>Educated</b> on time
      </>
    ),
    time: "3 days ago",
  },
  {
    color: "bg-cyan-500",
    text: (
      <>
        Added <b>Project Hail Mary</b> to Want to Read
      </>
    ),
    time: "4 days ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-slate-700">
        Recent Activity
      </h2>

      <div className="mt-4 space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            <div className="pt-1.5">
              <div className={`size-2 rounded-full ${activity.color}`} />
            </div>

            <div>
              <p className="text-sm text-slate-600">{activity.text}</p>

              <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
