import type { Metadata } from "next";
import SideBar from "@/Components/Sidebar/UserSidebar/UserSidebar";
import { getSessionUser } from "@/Helper/userFromToken";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Library",
  description: "User library dashboard",
};

export default async function UserLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.isAdmin) redirect(`/admin/${user._id}`);

  if (id !== user._id) {
    const path = (await headers()).get("x-pathname") || `/user/${id}`;
    const nextPath = path.startsWith(`/user/${id}`)
      ? `/user/${user._id}${path.slice(`/user/${id}`.length)}`
      : `/user/${user._id}`;
    redirect(nextPath);
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "R";

  return (
    <SideBar userId={user._id} name={user.name} initials={initials}>
      {children}
    </SideBar>
  );
}
