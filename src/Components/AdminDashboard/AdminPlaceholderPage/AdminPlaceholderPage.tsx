interface AdminPlaceholderPageProps {
  title: string;
}

export default function AdminPlaceholderPage({
  title,
}: AdminPlaceholderPageProps) {
  return (
    <main className="min-h-full bg-[#F9FAFB] p-5 md:p-7 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          This section is coming next. Use the sidebar to return to Dashboard.
        </p>
      </header>
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-400 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        {title} management will live here.
      </div>
    </main>
  );
}
