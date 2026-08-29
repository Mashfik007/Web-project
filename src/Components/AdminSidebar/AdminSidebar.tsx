"use client";

import {
  AuthorsIcon,
  BarcodeIcon,
  BooksIcon,
  BorrowRequestsIcon,
  CategoriesIcon,
  DashboardIcon,
  DigitalLibraryIcon,
  FinesIcon,
  FolioBookIcon,
  MenuIcon,
  NotificationsIcon,
  PublishersIcon,
  ReportsIcon,
  ReservationsIcon,
  ReturnsIcon,
  SignOutIcon,
  UsersIcon,
} from "@/Components/AdminSidebar/AdminIcons";
import { adminHref, adminSections } from "@/Components/AdminSidebar/adminNav";
import { logout } from "@/Controller/users.controller";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const sectionIcons: Record<string, ReactNode> = {
  books: <BooksIcon />,
  categories: <CategoriesIcon />,
  authors: <AuthorsIcon />,
  publishers: <PublishersIcon />,
  users: <UsersIcon />,
  "borrow-requests": <BorrowRequestsIcon />,
  returns: <ReturnsIcon />,
  reservations: <ReservationsIcon />,
  fines: <FinesIcon />,
  "digital-library": <DigitalLibraryIcon />,
  reports: <ReportsIcon />,
  notifications: <NotificationsIcon />,
  barcode: <BarcodeIcon />,
};

function closeDrawer() {
  const input = document.getElementById(
    "admin-drawer",
  ) as HTMLInputElement | null;
  if (input) input.checked = false;
}

export default function AdminSidebar({ children }: { children: ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const adminId = params.id as string;
  const [isSigningOut, setIsSigningOut] = useState(false);

  const dashboardHref = adminHref(adminId);
  const isDashboard = pathname === dashboardHref;

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
    <div className="drawer lg:drawer-open h-screen">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex h-screen flex-col overflow-y-auto bg-[#F9FAFB]">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
          <label
            htmlFor="admin-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost btn-sm text-slate-700"
          >
            <MenuIcon />
          </label>
          <span className="font-serif text-base font-semibold text-slate-800">
            Folio Admin
          </span>
        </div>
        <div className="flex-1">{children}</div>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="admin-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <aside className="flex min-h-full w-64 flex-col bg-[#0B1E2D] text-slate-300">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-sky-500 text-white shadow-[0_0_16px_rgba(56,189,248,0.35)]">
              <FolioBookIcon />
            </span>
            <div>
              <p className="font-serif text-lg leading-none font-bold text-white">
                Folio
              </p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-slate-400 uppercase">
                Admin
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href={dashboardHref}
                  onClick={closeDrawer}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isDashboard
                      ? "bg-gradient-to-r from-sky-500/20 to-sky-400/5 font-medium text-sky-300 shadow-[inset_1px_1px_0_rgba(125,211,252,0.35)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <DashboardIcon />
                  Dashboard
                </Link>
              </li>

              {adminSections.map((section) => {
                const href = adminHref(adminId, section.slug);
                const isActive = pathname === href;

                return (
                  <li key={section.slug}>
                    <Link
                      href={href}
                      onClick={closeDrawer}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-gradient-to-r from-sky-500/20 to-sky-400/5 font-medium text-sky-300 shadow-[inset_1px_1px_0_rgba(125,211,252,0.35)]"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      {sectionIcons[section.slug]}
                      {section.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-red-300 disabled:opacity-60"
            >
              <SignOutIcon />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
