import type { ReactNode } from "react";

// title + optional "Add" button. Used on every admin catalog/ops page.

interface AdminPageShellProps {
  title: string;
  subtitle: string;
  addLabel?: string;
  onAdd?: () => void;
  headerRight?: ReactNode;
  framed?: boolean;
  children: ReactNode;
}

export default function AdminPageShell({
  title,
  subtitle,
  addLabel,
  onAdd,
  headerRight,
  framed = true,
  children,
}: AdminPageShellProps) {
  return (
    <main className="bg-base-200 min-h-full p-5 md:p-7 lg:p-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-base-content/50 mt-1 text-sm">{subtitle}</p>
        </div>
        {headerRight ??
          (addLabel ? (
            <button type="button" onClick={onAdd} className="btn btn-primary">
              <span className="text-base leading-none">+</span>
              {addLabel}
            </button>
          ) : null)}
      </header>
      {framed ? (
        <section className="card bg-base-100 shadow-sm">{children}</section>
      ) : (
        children
      )}
    </main>
  );
}
