const books = [
  { month: "Feb", value: 2 },
  { month: "Mar", value: 3 },
  { month: "Apr", value: 4 },
  { month: "May", value: 2 },
  { month: "Jun", value: 5 },
  { month: "Jul", value: 4 },
];

export default function BooksPerMonth() {
  const maxValue = 5;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-lg font-bold text-slate-700">
        Books / Month
      </h2>

      <div className="mt-7 flex h-32 items-end justify-between gap-2">
        {books.map((book) => (
          <div
            key={book.month}
            className="flex flex-1 flex-col items-center justify-end"
          >
            <span className="mb-1 text-[10px] text-slate-500">
              {book.value}
            </span>

            <div
              style={{
                height: `${(book.value / maxValue) * 80}px`,
              }}
              className="w-full rounded-t-lg bg-sky-600/80"
            />

            <span className="mt-2 text-[10px] text-slate-500">
              {book.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
