"use client";

import Image from "next/image";
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

const iconClassName =
  "my-1.5 inline-block size-4 shrink-0 in-[.menu-active]:brightness-0 in-[.menu-active]:invert";

const navItems: NavItem[] = [
  {
    label: "Home",
    href: (userId) => `/user/${userId}`,
    match: (pathname, userId) => pathname === `/user/${userId}`,
    icon: (
      <Image
        src="/svg/home.svg"
        alt="Home"
        width={16}
        height={16}
        className={iconClassName}
      />
    ),
  },
  {
    label: "Browse Books",
    href: (userId) => `/user/${userId}/browsebook`,
    match: (pathname, userId) =>
      pathname.startsWith(`/user/${userId}/browsebook`) ||
      pathname.startsWith(`/user/${userId}/checkout`),
    icon: (
      <Image
        src="/svg/book.svg"
        alt="Book"
        width={16}
        height={16}
        className={iconClassName}
      />
    ),
  },
  {
    label: "My Shelf",
    href: (userId) => `/user/${userId}/shelf`,
    match: (pathname, userId) =>
      pathname === `/user/${userId}/shelf` ||
      pathname === `/user/${userId}/profile`,
    icon: (
      <Image
        src="/svg/shelf.svg"
        alt="Shelf"
        width={16}
        height={16}
        className={iconClassName}
      />
    ),
  },
  {
    label: "For You",
    href: (userId) => `/user/${userId}/foryou`,
    match: (pathname, userId) => pathname.startsWith(`/user/${userId}/foryou`),
    icon: (
      <Image
        src="/svg/shuffle.svg"
        alt="For You"
        width={16}
        height={16}
        className={iconClassName}
      />
    ),
  },
  {
    label: "Community Shelf",
    href: (userId) => `/user/${userId}/community`,
    match: (pathname, userId) =>
      pathname.startsWith(`/user/${userId}/community`),
    icon: (
      <Image
        src="/svg/users.svg"
        alt="Users"
        width={16}
        height={16}
        className={iconClassName}
      />
    ),
  },
  {
    label: "Borrow Requests",
    href: (userId) => `/user/${userId}/borrow-requests`,
    match: (pathname, userId) =>
      pathname.startsWith(`/user/${userId}/borrow-requests`),
    icon: (
      <Image
        src="/svg/user-plus.svg"
        alt="Add user"
        width={16}
        height={16}
        className={iconClassName}
      />
    ),
  },
  {
    label: "My Orders",
    href: (userId) => `/user/${userId}/orders`,
    match: (pathname, userId) => pathname.startsWith(`/user/${userId}/orders`),
    icon: (
      <Image
        src="/svg/package.svg"
        alt="Orders"
        width={16}
        height={16}
        className={iconClassName}
      />
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
