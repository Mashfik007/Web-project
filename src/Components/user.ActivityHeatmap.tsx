const activity = [
  0, 1, 0, 2, 1, 0, 1, 2, 1, 3, 0, 1, 1, 2, 3, 1, 0, 1, 2, 3, 2, 0, 1, 3, 3, 1,
  2, 3, 2, 1, 0, 2, 3, 1, 2, 3, 1, 2, 0, 1, 3, 2, 1, 3, 0, 2, 3, 1, 0, 1, 2, 3,
  1, 2, 3, 1, 0, 2, 1, 3, 1, 0, 2, 1, 3, 2, 1, 3, 0, 1, 2, 3,
];

const colors = ["bg-sky-50", "bg-sky-100", "bg-sky-300", "bg-sky-600"];

export default function ActivityHeatmap() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-slate-700">
          Activity
        </h2>

        <span className="text-[10px] text-slate-400">12 weeks</span>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-1.5">
        {activity.map((level, index) => (
          <div
            key={index}
            className={`aspect-square rounded-sm ${colors[level]}`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>Less</span>

        {colors.map((color, index) => (
          <div key={index} className={`size-3 rounded-sm ${color}`} />
        ))}

        <span>More</span>
      </div>
    </div>
  );
}
