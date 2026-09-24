import type { Metadata } from "next";
import AdminSidebar from "@/Components/AdminSidebar/AdminSidebar";
import { getSessionUser } from "@/Helper/userFromToken";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Folio Admin",
  description: "Library administration dashboard",
};

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect(`/user/${user._id}`);

  if (id !== user._id) {
    const path = (await headers()).get("x-pathname") || `/admin/${id}`;
    const nextPath = path.startsWith(`/admin/${id}`)
      ? `/admin/${user._id}${path.slice(`/admin/${id}`.length)}`
      : `/admin/${user._id}`;
    redirect(nextPath);
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
