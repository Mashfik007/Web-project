const days = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
];

const missedDays = [4, 11, 19];

export default function Streak() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-slate-700">Streak</h2>

        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5">
          <span className="text-amber-500">♨</span>

          <span className="text-lg font-bold text-slate-700">14</span>

          <span className="text-xs text-slate-500">days</span>
        </div>
      </div>

      {/* Week labels */}
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[9px] font-medium text-slate-400">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>

      {/* Calendar */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isMissed = missedDays.includes(Number(day));

          return (
            <div
              key={day}
              className={`flex aspect-square items-center justify-center rounded-lg text-[10px] font-medium ${
                isMissed
                  ? "bg-slate-100 text-slate-400"
                  : "bg-sky-600 text-white"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <i className="size-2 rounded bg-sky-600" />
            Read
          </span>

          <span className="flex items-center gap-1">
            <i className="size-2 rounded bg-slate-100" />
            Missed
          </span>
        </div>

        <span className="font-medium text-sky-700">Best: 22 days</span>
      </div>
    </div>
  );
}
