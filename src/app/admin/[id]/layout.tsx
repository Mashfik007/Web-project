import type { Metadata } from "next";
import AdminSidebar from "@/Components/AdminSidebar/AdminSidebar";

export const metadata: Metadata = {
  title: "Folio Admin",
  description: "Library administration dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
