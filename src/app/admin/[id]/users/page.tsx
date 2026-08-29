import UsersPage from "@/Components/AdminCatalog/UsersPage";
import { getUsersData } from "@/Components/AdminCatalog/data/getUsersData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const users = await getUsersData(id);

  return <UsersPage users={users} />;
}
