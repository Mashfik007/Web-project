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

function DrawerToggleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2"
      fill="none"
      stroke="currentColor"
      className="my-1.5 inline-block size-4"
    >
      <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
      <path d="M9 4v16" />
      <path d="M14 10l2 2-2 2" />
    </svg>
  );
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
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor={id}
            aria-label="open sidebar"
            className="btn btn-square btn-ghost drawer-button"
          >
            <DrawerToggleIcon />
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
        <div className="flex h-full min-h-full flex-col items-start bg-[linear-gradient(to_bottom,#6E8FAD_0%,#FFFFFF_35%,#579FDA_88%,#0EA5E9_130%)] text-black is-drawer-close:w-14 is-drawer-open:w-64">
          {sidebar}
        </div>
      </div>
    </div>
  );
}
