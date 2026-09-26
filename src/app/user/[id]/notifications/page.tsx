import UserNotificationsPage from "@/Components/Notifications/UserNotificationsPage/UserNotificationsPage";
import { getLibraryNotices } from "@/data/getNotices";

export const dynamic = "force-dynamic";

export default async function Page() {
  const notices = await getLibraryNotices();
  return <UserNotificationsPage notices={notices} />;
}
