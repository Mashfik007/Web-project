import AdminPlaceholderPage from "@/Components/AdminDashboard/AdminPlaceholderPage/AdminPlaceholderPage";
import {
  adminSections,
  isAdminSection,
} from "@/Components/AdminSidebar/adminNav";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; section: string }>;
}

export default async function Page({ params }: PageProps) {
  const { section } = await params;

  if (!isAdminSection(section)) {
    notFound();
  }

  const current = adminSections.find((item) => item.slug === section);

  return <AdminPlaceholderPage title={current?.label ?? section} />;
}
