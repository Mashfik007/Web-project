"use client";

import { adminHref, adminSections } from "@/Components/AdminSidebar/adminNav";
import AppDrawer, {
  closeDrawer,
  drawerItemClass,
} from "@/Components/Sidebar/AppDrawer/AppDrawer";
import { logout } from "@/Controller/users.controller";
import { getChatSocket } from "@/lib/chatSocket";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const DRAWER_ID = "admin-drawer";
const iconClass =
  "my-1.5 inline-block size-4 shrink-0 in-[.menu-active]:brightness-0 in-[.menu-active]:invert";

const sectionIcons: Record<string, ReactNode> = {
  books: (
    <Image
      src="/svg/book.svg"
      alt="Books"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  categories: (
    <Image
      src="/svg/tag.svg"
      alt="Categories"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  authors: (
    <Image
      src="/svg/pencil.svg"
      alt="Authors"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  publishers: (
    <Image
      src="/svg/building.svg"
      alt="Publishers"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  users: (
    <Image
      src="/svg/users.svg"
      alt="Users"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  community: (
    <Image
      src="/svg/users.svg"
      alt="Community"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  "borrow-requests": (
    <Image
      src="/svg/clipboard.svg"
      alt="Borrow requests"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  returns: (
    <Image
      src="/svg/rotate-ccw.svg"
      alt="Returns"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  reservations: (
    <Image
      src="/svg/calendar.svg"
      alt="Reservations"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  fines: (
    <Image
      src="/svg/credit-card.svg"
      alt="Fines"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  "digital-library": (
    <Image
      src="/svg/shelf.svg"
      alt="Digital library"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  reports: (
    <Image
      src="/svg/chart.svg"
      alt="Reports"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  notifications: (
    <Image
      src="/svg/bell.svg"
      alt="Notifications"
      width={16}
      height={16}
      className={iconClass}
    />
  ),
  barcode: (
    <Image
      src="/svg/barcode.svg"
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

  useEffect(() => {
    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onBorrowUpdate(update: { scope?: string; action?: string }) {
      if (update?.scope !== "library") return;
      // Keep admin lists in sync as soon as a member submits a request.
      router.refresh();
    }

    socket.on("connect", syncRooms);
    socket.on("borrow:update", onBorrowUpdate);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      socket.off("borrow:update", onBorrowUpdate);
    };
    // router.refresh identity is stable enough for this live subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                src="/svg/book.svg"
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
                  src="/svg/dashboard.svg"
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
                src="/svg/sign-out.svg"
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
