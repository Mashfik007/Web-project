import Image from "next/image";
import chevronLeftIcon from "@svg/chevron-left.svg";
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
        <Image
          src={chevronLeftIcon}
          alt="Back"
          width={16}
          height={16}
          className="size-4"
        />
        Back
      </Link>

      <h1 className="mt-3 font-serif text-3xl font-bold text-slate-800 md:text-4xl">
        {title}
      </h1>
      <p className="text-sm text-sky-600">{subtitle}</p>
    </header>
  );
}
