"use client";

import AppDrawer, {
  closeDrawer,
  drawerItemClass,
} from "@/Components/Sidebar/AppDrawer/AppDrawer";
import SidebarProfile from "@/Components/Sidebar/SidebarProfile/SidebarProfile";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";

const DRAWER_ID = "user-drawer";

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
  const activeItem = navItems.find((item) => item.match(pathname, userId));

  return (
    <AppDrawer
      id={DRAWER_ID}
      title={activeItem?.label ?? "Library"}
      sidebar={
        <>
          <ul className="menu is-drawer-close:overflow-visible w-full grow overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.match(pathname, userId);
              const href = item.href(userId);

              return (
                <li key={item.label}>
                  <Link
                    href={href}
                    onClick={() => closeDrawer(DRAWER_ID)}
                    className={drawerItemClass(isActive)}
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
        </>
      }
    >
      <div className="p-4">{children}</div>
    </AppDrawer>
  );
}
