import Image from "next/image";
import sidebarToggleIcon from "@svg/sidebar-toggle.svg";
import type { ReactNode } from "react";

interface AppDrawerProps {
  id: string;
  title: string;
  sidebar: ReactNode;
  children: ReactNode;
}

export function drawerItemClass(isActive = false) {
  return `is-drawer-close:tooltip is-drawer-close:tooltip-right${
    isActive ? " menu-active" : ""
  }`;
}

export function closeDrawer(id: string) {
  if (window.matchMedia("(min-width: 1024px)").matches) return;
  const input = document.getElementById(id) as HTMLInputElement | null;
  if (input) input.checked = false;
}

export default function AppDrawer({
  id,
  title,
  sidebar,
  children,
}: AppDrawerProps) {
  return (
    <div className="drawer lg:drawer-open h-screen">
      <input id={id} type="checkbox" className="drawer-toggle inline" />

      <div className="drawer-content flex h-screen flex-col overflow-y-auto">
        <nav className="navbar bg-base-300 w-full">
          <label
            htmlFor={id}
            aria-label="open sidebar"
            className="btn btn-square btn-ghost drawer-button"
          >
            <Image
              priority
              src={sidebarToggleIcon}
              alt="Toggle sidebar"
              width={16}
              height={16}
              className="my-1.5 inline-block size-4"
            />
          </label>
          <div className="px-4">{title}</div>
        </nav>
        <div className="flex-1">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor={id}
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="is-drawer-close:w-14 is-drawer-open:w-64 flex h-full min-h-full flex-col items-start bg-[linear-gradient(to_bottom,#6E8FAD_0%,#FFFFFF_35%,#579FDA_88%,#0EA5E9_130%)] text-black">
          {sidebar}
        </div>
      </div>
    </div>
  );
}
