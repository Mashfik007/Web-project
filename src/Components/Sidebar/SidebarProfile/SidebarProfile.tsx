"use client";

import { logout } from "@/Controller/users.controller";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProfileProps {
  userId: string;
  name?: string;
  initials?: string;
  branch?: string;
}

export default function SidebarProfile({
  userId,
  name = "Elara Ashford",
  initials = "EA",
  branch = "Riverside Branch",
}: SidebarProfileProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="mt-auto w-full rounded-b-3xl border-t border-white/40 bg-white/95 p-2 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <Link
        href={`/user/${userId}/shelf`}
        className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-3 rounded-2xl p-2 transition hover:bg-sky-50"
        data-tip={name}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-sm">
          {initials}
        </span>

        <div className="is-drawer-close:hidden min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
          <p className="truncate text-xs text-slate-500">{branch}</p>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="is-drawer-close:tooltip is-drawer-close:tooltip-right mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
        data-tip="Sign out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 shrink-0"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
        <span className="is-drawer-close:hidden">
          {isSigningOut ? "Signing out..." : "Sign out"}
        </span>
      </button>
    </div>
  );
}
