import ReportsPage from "@/Components/AdminOps/ReportsPage/ReportsPage";
import { getAdminReports } from "@/data/adminOpsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const { trends, topBooks } = await getAdminReports(id);

  return <ReportsPage trends={trends} topBooks={topBooks} />;
}
