import Image from "next/image";

const navItems = [
  "Dashboard",
  "Browse Books",
  "My Shelf",
  "Community",
  "For You",
];

export default function LandingFooter() {
  return (
    <footer className="bg-[#0b1e2d] text-slate-300">
      <div className="grid gap-10 px-4 py-14 sm:px-8 lg:grid-cols-3 lg:px-12 xl:px-20">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <span className="bg-primary flex size-9 items-center justify-center rounded-lg">
              <Image
                src="/svg/book.svg"
                alt=""
                width={16}
                height={16}
                className="size-4 brightness-0 invert"
              />
            </span>
            <span className="font-serif text-xl font-bold">Folio</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            A community library for readers who want to borrow, track, and talk
            about books in one place.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm">
            <Image
              src="/svg/phone.svg"
              alt=""
              width={16}
              height={16}
              className="size-4 invert"
            />
            0112288997
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
            NAVIGATE
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
            STAY IN THE LOOP
          </p>
          <p className="mt-4 text-sm text-slate-400">
            New arrivals and reading tips, once a week.
          </p>
          <form className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="input input-sm border-white/10 bg-[#15293a] text-white placeholder:text-slate-500"
            />
            <button type="button" className="btn btn-primary btn-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 xl:px-20">
        <p>© 2026 Folio. All rights reserved.</p>
        <div className="flex gap-5">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
}
