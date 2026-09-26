import NotificationsPage from "@/Components/AdminOps/NotificationsPage/NotificationsPage";
import { getAdminNotices } from "@/data/getNotices";

export const dynamic = "force-dynamic";

export default async function Page() {
  const notices = await getAdminNotices();
  return <NotificationsPage notices={notices} />;
}
