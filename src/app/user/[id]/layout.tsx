import type { Metadata } from "next";
import SideBar from "@/Components/user.Sidebar";

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
