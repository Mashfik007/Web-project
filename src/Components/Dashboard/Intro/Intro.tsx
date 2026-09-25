import Image from "next/image";
import Link from "next/link";
import SearchButton from "@/Components/Button/SearchButton/SearchButton";
import type { DashboardIntro } from "@/types/dashboard";

interface IntroProps {
  intro: DashboardIntro;
}

export default function Intro({ intro }: IntroProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-b-[22px] bg-gradient-to-r from-[#142536] via-[#183a55] to-[#07567d] px-6 py-7 md:px-14 md:py-8">
      <div className="absolute right-8 bottom-0 flex items-end gap-2 opacity-30">
        <div className="h-16 w-3 rounded-t-md bg-sky-300" />
        <div className="h-24 w-3 rounded-t-md bg-sky-300" />
        <div className="h-12 w-3 rounded-t-md bg-sky-300" />
        <div className="h-32 w-3 rounded-t-md bg-sky-300" />
        <div className="h-20 w-3 rounded-t-md bg-sky-300" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-xs font-medium tracking-[0.18em] text-sky-300">
            {intro.greeting}
          </p>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            {intro.name}
          </h1>

          <p className="mt-2 text-sm tracking-wide text-slate-300 md:text-base">
            {intro.dueBooks} books due this week ·{" "}
            <span className="font-semibold text-white">
              {intro.streak}-day streak
            </span>{" "}
            🔥
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={intro.browseHref}>
            <SearchButton label="Book Search" />
          </Link>

          <Link
            href={intro.forYouHref}
            className="flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all duration-200 hover:bg-sky-300"
          >
            <Image
              src="/svg/shuffle.svg"
              alt="For You"
              width={16}
              height={16}
              className="size-4"
            />
            For You
          </Link>
        </div>
      </div>
    </section>
  );
}
