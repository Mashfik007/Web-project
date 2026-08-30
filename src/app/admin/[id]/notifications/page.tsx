import NotificationsPage from "@/Components/AdminOps/NotificationsPage/NotificationsPage";
import { getAdminNotices } from "@/data/adminOpsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const notices = await getAdminNotices(id);

  return <NotificationsPage notices={notices} />;
}
