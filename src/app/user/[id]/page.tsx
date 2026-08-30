import DashboardPage from "@/Components/Dashboard/DashboardPage/DashboardPage";
import { getDashboardData } from "@/data/getDashboardData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const dashboard = await getDashboardData(id);

  return <DashboardPage dashboard={dashboard} />;
}
