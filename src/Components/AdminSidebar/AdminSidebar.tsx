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
  NotificationsIcon,
  PublishersIcon,
  ReportsIcon,
  ReservationsIcon,
  ReturnsIcon,
  SignOutIcon,
  UsersIcon,
} from "@/Components/AdminSidebar/AdminIcons/AdminIcons";
import { adminHref, adminSections } from "@/Components/AdminSidebar/adminNav";
import AppDrawer, {
  closeDrawer,
  drawerItemClass,
} from "@/Components/Sidebar/AppDrawer/AppDrawer";
import { logout } from "@/Controller/users.controller";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const DRAWER_ID = "admin-drawer";

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

export default function AdminSidebar({ children }: { children: ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const adminId = params.id as string;
  const [isSigningOut, setIsSigningOut] = useState(false);

  const dashboardHref = adminHref(adminId);
  const isDashboard = pathname === dashboardHref;
  const activeSection = adminSections.find(
    (section) => pathname === adminHref(adminId, section.slug),
  );
  const title = isDashboard ? "Dashboard" : (activeSection?.label ?? "Admin");

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
    <AppDrawer
      id={DRAWER_ID}
      title={title}
      sidebar={
        <>
          <div className="flex w-full items-center gap-2 px-2 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content">
              <FolioBookIcon />
            </span>
            <div className="is-drawer-close:hidden min-w-0">
              <p className="font-serif text-sm leading-none font-bold text-slate-800">
                Folio
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-slate-600 uppercase">
                Admin
              </p>
            </div>
          </div>

          <ul className="menu is-drawer-close:overflow-visible w-full grow overflow-y-auto">
            <li>
              <Link
                href={dashboardHref}
                onClick={() => closeDrawer(DRAWER_ID)}
                className={drawerItemClass(isDashboard)}
                data-tip="Dashboard"
              >
                <DashboardIcon />
                <span className="is-drawer-close:hidden">Dashboard</span>
              </Link>
            </li>

            {adminSections.map((section) => {
              const href = adminHref(adminId, section.slug);
              const isActive = pathname === href;

              return (
                <li key={section.slug}>
                  <Link
                    href={href}
                    onClick={() => closeDrawer(DRAWER_ID)}
                    className={drawerItemClass(isActive)}
                    data-tip={section.label}
                  >
                    {sectionIcons[section.slug]}
                    <span className="is-drawer-close:hidden">
                      {section.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="w-full border-t border-white/40 bg-white/95 p-2 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="btn btn-ghost btn-sm is-drawer-close:tooltip is-drawer-close:tooltip-right w-full justify-start text-error"
              data-tip="Sign out"
            >
              <SignOutIcon />
              <span className="is-drawer-close:hidden">
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </span>
            </button>
          </div>
        </>
      }
    >
      {children}
    </AppDrawer>
  );
}
