"use client";

import { logout } from "@/Controller/users.controller";
import { useRouter } from "next/navigation";
import { useState } from "react";

const adminPhone = "01921591087";

export default function SuspendedAccount() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold tracking-[0.16em] text-rose-500">ACCOUNT SUSPENDED</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-800">
          Contact the admin
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          This account is suspended, so the library is unavailable until an admin restores it.
        </p>
        <a
          href={`tel:${adminPhone}`}
          className="mt-6 inline-flex rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white"
        >
          {adminPhone}
        </a>
        <button
          type="button"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void logout().then(() => router.push("/login"));
          }}
          className="btn btn-ghost btn-sm mt-6"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </section>
    </main>
  );
}
