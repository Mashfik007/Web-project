"use client";

// user site sidebar (home, browse, shelf, etc.)
import SidebarProfile from "@/Components/Sidebar/SidebarProfile/SidebarProfile";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  label: string;
  href: (userId: string) => string;
  match: (pathname: string, userId: string) => boolean;
  icon: ReactNode;
};

const iconClassName = "my-1.5 inline-block size-4 shrink-0";

const navItems: NavItem[] = [
  {
    label: "Home",
    href: (userId) => `/user/${userId}`,
    match: (pathname, userId) => pathname === `/user/${userId}`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className={iconClassName}
      >
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    label: "Browse Books",
    href: (userId) => `/user/${userId}/browsebook`,
    match: (pathname, userId) =>
      pathname.startsWith(`/user/${userId}/browsebook`) ||
      pathname.startsWith(`/user/${userId}/checkout`),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className={iconClassName}
      >
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  {
    label: "My Shelf",
    href: (userId) => `/user/${userId}/shelf`,
    match: (pathname, userId) =>
      pathname === `/user/${userId}/shelf` ||
      pathname === `/user/${userId}/profile`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className={iconClassName}
      >
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 17V9" />
        <path d="M12 17V7" />
        <path d="M16 17v-5" />
      </svg>
    ),
  },
  {
    label: "For You",
    href: (userId) => `/user/${userId}/foryou`,
    match: (pathname, userId) => pathname.startsWith(`/user/${userId}/foryou`),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className={iconClassName}
      >
        <path d="m16 3 4 4-4 4" />
        <path d="M4 7h3c4 0 5 10 9 10h4" />
        <path d="m16 13 4 4-4 4" />
        <path d="M4 17h3c1.5 0 2.5-1.5 3.5-3.5" />
      </svg>
    ),
  },
  {
    label: "Community Shelf",
    href: (userId) => `/user/${userId}/community`,
    match: (pathname, userId) =>
      pathname.startsWith(`/user/${userId}/community`),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className={iconClassName}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Borrow Requests",
    href: (userId) => `/user/${userId}/borrow-requests`,
    match: (pathname, userId) =>
      pathname.startsWith(`/user/${userId}/borrow-requests`),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className={iconClassName}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" x2="19" y1="8" y2="14" />
        <line x1="22" x2="16" y1="11" y2="11" />
      </svg>
    ),
  },
  {
    label: "My Orders",
    href: (userId) => `/user/${userId}/orders`,
    match: (pathname, userId) => pathname.startsWith(`/user/${userId}/orders`),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className={iconClassName}
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

export default function SideBar({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const userId = params.id as string;

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle inline"
      />

      <div className="drawer-content">
        <nav className="navbar h-10 min-h-0 w-full p-0">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost btn-sm drawer-button text-black hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M9 4v16" />
              <path d="M14 10l2 2-2 2" />
            </svg>
          </label>
        </nav>

        <div className="p-4">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <div className="is-drawer-close:w-14 is-drawer-open:w-64 flex min-h-full flex-col overflow-hidden rounded-b-3xl bg-[linear-gradient(to_bottom,#6E8FAD_0%,#FFFFFF_35%,#579FDA_88%,#0EA5E9_130%)] text-black">
          <div className="is-drawer-close:hidden border-b border-white/30 px-4 py-4">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-600 uppercase">
              Folio Network
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              Library Menu
            </p>
          </div>

          <ul className="menu w-full grow gap-1 p-2">
            {navItems.map((item) => {
              const isActive = item.match(pathname, userId);
              const href = item.href(userId);

              return (
                <li key={item.label}>
                  <Link
                    href={href}
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                      isActive ? "menu-active" : ""
                    }`}
                    data-tip={item.label}
                  >
                    {item.icon}
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <SidebarProfile userId={userId} />
        </div>
      </div>
    </div>
  );
}
