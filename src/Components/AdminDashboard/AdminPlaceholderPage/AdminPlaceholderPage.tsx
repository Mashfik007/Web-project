interface AdminPlaceholderPageProps {
  title: string;
}

export default function AdminPlaceholderPage({
  title,
}: AdminPlaceholderPageProps) {
  return (
    <main className="bg-base-200 min-h-full p-5 md:p-7 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-base-content/50 mt-1 text-sm">
          This section is coming next. Use the sidebar to return to Dashboard.
        </p>
      </header>
      <div className="card bg-base-100 text-base-content/40 px-6 py-16 text-center text-sm shadow-sm">
        {title} management will live here.
      </div>
    </main>
  );
}
