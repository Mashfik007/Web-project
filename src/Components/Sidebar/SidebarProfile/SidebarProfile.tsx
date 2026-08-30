"use client";

import Image from "next/image";
import signOutIcon from "@svg/sign-out.svg";
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
    <div className="mt-auto w-full border-t border-white/40 bg-white/95 p-2 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <Link
        href={`/user/${userId}/shelf`}
        className="is-drawer-close:tooltip is-drawer-close:tooltip-right hover:bg-primary/10 flex items-center gap-3 rounded-2xl p-2"
        data-tip={name}
      >
        <span className="bg-primary text-primary-content flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {initials}
        </span>

        <div className="is-drawer-close:hidden min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {name}
          </p>
          <p className="truncate text-xs text-slate-500">{branch}</p>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="btn btn-ghost btn-sm is-drawer-close:tooltip is-drawer-close:tooltip-right text-error mt-1 w-full justify-start"
        data-tip="Sign out"
      >
        <Image
          src={signOutIcon}
          alt="Sign out"
          width={16}
          height={16}
          className="my-1.5 inline-block size-4 shrink-0"
        />
        <span className="is-drawer-close:hidden">
          {isSigningOut ? "Signing out..." : "Sign out"}
        </span>
      </button>
    </div>
  );
}
