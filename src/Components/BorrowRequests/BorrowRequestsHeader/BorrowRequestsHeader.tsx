interface BorrowRequestsHeaderProps {
  title: string;
  subtitle: string;
}

export default function BorrowRequestsHeader({
  title,
  subtitle,
}: BorrowRequestsHeaderProps) {
  return (
    <header className="space-y-1">
      <h1 className="font-serif text-3xl font-bold text-slate-800 md:text-4xl">
        {title}
      </h1>
      <p className="text-sm text-sky-600">{subtitle}</p>
    </header>
  );
}
