interface AdminPlaceholderPageProps {
  title: string;
}

export default function AdminPlaceholderPage({
  title,
}: AdminPlaceholderPageProps) {
  return (
    <main className="min-h-full bg-base-200 p-5 md:p-7 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-base-content/50">
          This section is coming next. Use the sidebar to return to Dashboard.
        </p>
      </header>
      <div className="card bg-base-100 px-6 py-16 text-center text-sm text-base-content/40 shadow-sm">
        {title} management will live here.
      </div>
    </main>
  );
}
