import FinesPage from "@/Components/AdminOps/FinesPage/FinesPage";
import { getAdminFines } from "@/Components/AdminOps/data/adminOpsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const { summary, fines } = await getAdminFines(id);

  return <FinesPage summary={summary} fines={fines} />;
}
