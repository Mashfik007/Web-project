"use client";

import { adminHref, adminSections } from "@/Components/AdminSidebar/adminNav";
import AppDrawer, {
  closeDrawer,
  drawerItemClass,
} from "@/Components/Sidebar/AppDrawer/AppDrawer";
import { logout } from "@/Controller/users.controller";
import Image from "next/image";
import barcodeIcon from "@svg/barcode.svg";
import bellIcon from "@svg/bell.svg";
import bookIcon from "@svg/book.svg";
import buildingIcon from "@svg/building.svg";
import calendarIcon from "@svg/calendar.svg";
import chartIcon from "@svg/chart.svg";
import clipboardIcon from "@svg/clipboard.svg";
import creditCardIcon from "@svg/credit-card.svg";
import dashboardIcon from "@svg/dashboard.svg";
import pencilIcon from "@svg/pencil.svg";
import rotateCcwIcon from "@svg/rotate-ccw.svg";
import shelfIcon from "@svg/shelf.svg";
import signOutIcon from "@svg/sign-out.svg";
import tagIcon from "@svg/tag.svg";
import usersIcon from "@svg/users.svg";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const DRAWER_ID = "admin-drawer";
const iconClass =
  "my-1.5 inline-block size-4 shrink-0 in-[.menu-active]:brightness-0 in-[.menu-active]:invert";

const sectionIcons: Record<string, ReactNode> = {
  books: (
    <Image
      src={bookIcon}
      alt="Books"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  categories: (
    <Image
      src={tagIcon}
      alt="Categories"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  authors: (
    <Image
      src={pencilIcon}
      alt="Authors"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  publishers: (
    <Image
      src={buildingIcon}
      alt="Publishers"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  users: (
    <Image
      src={usersIcon}
      alt="Users"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  "borrow-requests": (
    <Image
      src={clipboardIcon}
      alt="Borrow requests"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  returns: (
    <Image
      src={rotateCcwIcon}
      alt="Returns"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  reservations: (
    <Image
      src={calendarIcon}
      alt="Reservations"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  fines: (
    <Image
      src={creditCardIcon}
      alt="Fines"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  "digital-library": (
    <Image
      src={shelfIcon}
      alt="Digital library"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  reports: (
    <Image
      src={chartIcon}
      alt="Reports"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  notifications: (
    <Image
      src={bellIcon}
      alt="Notifications"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  barcode: (
    <Image
      src={barcodeIcon}
      alt="Barcode"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
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
            <span className="bg-primary text-primary-content flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Image
                src={bookIcon}
                alt="Folio"
                width={16}
                height={16}
                className="size-4"
              />
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
                <Image
                  src={dashboardIcon}
                  alt="Dashboard"
                  width={16}
                  height={16}
                  className={iconClass}
                />
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
              className="btn btn-ghost btn-sm is-drawer-close:tooltip is-drawer-close:tooltip-right text-error w-full justify-start"
              data-tip="Sign out"
            >
              <Image
                src={signOutIcon}
                alt="Sign out"
                width={16}
                height={16}
                className={iconClass}
              />
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
