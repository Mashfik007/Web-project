import NotificationsPage from "@/Components/AdminOps/NotificationsPage/NotificationsPage";
import { getAdminNotices } from "@/data/getNotices";
import { getNotificationRecipients } from "@/data/getNotificationRecipients";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [notices, recipients] = await Promise.all([
    getAdminNotices(),
    getNotificationRecipients(),
  ]);
  return <NotificationsPage notices={notices} recipients={recipients} />;
}
