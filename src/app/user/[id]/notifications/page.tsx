import UserNotificationsPage from "@/Components/Notifications/UserNotificationsPage/UserNotificationsPage";
import { getLibraryNotices } from "@/data/getNotices";
import { getSessionUser } from "@/Helper/userFromToken";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const notices = await getLibraryNotices(user._id);
  return <UserNotificationsPage notices={notices} />;
}
