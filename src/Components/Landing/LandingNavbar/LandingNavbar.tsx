import Image from "next/image";
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white">
      <nav className="navbar min-h-16 w-full px-4 sm:px-8 lg:px-12 xl:px-20">
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <span className="bg-primary flex size-9 items-center justify-center rounded-lg">
              <Image
                src="/svg/book.svg"
                alt=""
                width={16}
                height={16}
                className="size-4 brightness-0 invert"
              />
            </span>
            <span className="font-serif text-xl font-bold tracking-tight">
              Folio
            </span>
          </div>
        </div>

        <div className="flex-none">
          <Link href="/login" className="btn btn-primary btn-sm">
            Log in
          </Link>
        </div>
      </nav>
    </header>
  );
}
