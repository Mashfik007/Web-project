import UsersPage from "@/Components/AdminCatalog/UsersPage/UsersPage";
import { getArchivedUsers } from "@/data/getArchivedUsers";
import { getUsersData } from "@/data/getUsersData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [users, archivedUsers] = await Promise.all([
    getUsersData(id),
    getArchivedUsers(),
  ]);

  return <UsersPage users={users} archivedUsers={archivedUsers} />;
}
