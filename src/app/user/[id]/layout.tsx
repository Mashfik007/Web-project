import type { Metadata } from "next";
import SideBar from "@/Components/Sidebar/UserSidebar/UserSidebar";

export const metadata: Metadata = {
  title: "Library",
  description: "User library dashboard",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SideBar>{children}</SideBar>;
}
