import Image from "next/image";
import Link from "next/link";

interface BackLinkProps {
  href: string;
}

export default function BackLink({ href }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-sky-600"
    >
      <Image
        src="/svg/chevron-left.svg"
        alt="Back"
        width={16}
        height={16}
        className="size-4"
      />
      Back to Browse
    </Link>
  );
}
