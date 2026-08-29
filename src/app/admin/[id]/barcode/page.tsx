import BarcodePage from "@/Components/AdminOps/BarcodePage";
import { getAdminScans } from "@/Components/AdminOps/data/adminOpsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const scans = await getAdminScans(id);

  return <BarcodePage scans={scans} />;
}
