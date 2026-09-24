import AdminDashboardPage from "@/Components/AdminDashboard/AdminDashboardPage/AdminDashboardPage";
import { getAdminDashboardData } from "@/data/getAdminDashboardData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const dashboard = await getAdminDashboardData(id);

  return <AdminDashboardPage dashboard={dashboard} />;
}
