import Image from "next/image";
import bookIcon from "@svg/book.svg";
import type { ReactNode } from "react";

type AuthStat = {
  value: string;
  label: string;
};

interface AuthLayoutProps {
  children: ReactNode;
  headline: string;
  description: string;
  stats: AuthStat[];
  variant?: "login" | "register";
}

export default function AuthLayout({
  children,
  headline,
  description,
  stats,
  variant = "login",
}: AuthLayoutProps) {
  const isLogin = variant === "login";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section
        className={`relative hidden min-h-screen flex-col justify-between overflow-hidden px-10 py-10 lg:flex lg:px-14 lg:py-12 ${
          isLogin
            ? "bg-gradient-to-br from-sky-100 via-sky-300 to-sky-500 text-white"
            : "bg-gradient-to-br from-white via-sky-50 to-sky-200 text-slate-800"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isLogin
              ? "bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.38)_48%,transparent_66%)]"
              : "bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.7)_48%,transparent_66%)]"
          }`}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <span
            className={`flex size-9 items-center justify-center rounded-lg ${
              isLogin ? "bg-white/20 text-white" : "bg-slate-900 text-white"
            }`}
          >
            <Image
              src={bookIcon}
              alt="Folio"
              width={16}
              height={16}
              className="size-4"
            />
          </span>
          <span
            className={`text-xl font-semibold tracking-tight ${
              isLogin ? "font-sans text-white" : "font-serif text-slate-900"
            }`}
          >
            Folio
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1
            className={`font-serif text-5xl leading-tight font-bold tracking-tight ${
              isLogin ? "text-slate-900" : "text-slate-900"
            }`}
          >
            {headline}
          </h1>
          <p
            className={`mt-5 max-w-md text-base leading-7 ${
              isLogin ? "text-white/90" : "text-slate-500"
            }`}
          >
            {description}
          </p>
        </div>

        <dl className="relative z-10 grid max-w-md grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt
                className={`font-serif text-2xl font-bold ${
                  isLogin ? "text-white" : "text-slate-700"
                }`}
              >
                {stat.value}
              </dt>
              <dd
                className={`mt-1 text-sm ${
                  isLogin ? "text-white/80" : "text-slate-400"
                }`}
              >
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className={`flex items-center justify-center px-4 py-10 ${
          isLogin ? "bg-white" : "bg-slate-50"
        }`}
      >
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Image
                src={bookIcon}
                alt="Folio"
                width={16}
                height={16}
                className="size-4"
              />
            </span>
            <span className="font-serif text-xl font-semibold text-slate-900">
              Folio
            </span>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-10">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
