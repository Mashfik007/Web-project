interface MyOrdersHeaderProps {
  title: string;
  subtitle: string;
}

export default function MyOrdersHeader({ title, subtitle }: MyOrdersHeaderProps) {
  return (
    <header className="space-y-1">
      <h1 className="font-serif text-3xl font-bold text-slate-800 md:text-4xl">
        {title}
      </h1>
      <p className="text-sm text-sky-600">{subtitle}</p>
    </header>
  );
}
