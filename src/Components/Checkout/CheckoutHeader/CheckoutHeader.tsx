import Link from "next/link";

interface CheckoutHeaderProps {
  title: string;
  subtitle: string;
  backHref: string;
}

export default function CheckoutHeader({
  title,
  subtitle,
  backHref,
}: CheckoutHeaderProps) {
  return (
    <header className="space-y-1">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-sky-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </Link>

      <h1 className="mt-3 font-serif text-3xl font-bold text-slate-800 md:text-4xl">
        {title}
      </h1>
      <p className="text-sm text-sky-600">{subtitle}</p>
    </header>
  );
}
