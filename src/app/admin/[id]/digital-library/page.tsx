import DigitalLibraryPage from "@/Components/AdminOps/DigitalLibraryPage";
import { getAdminDigitalResources } from "@/Components/AdminOps/data/adminOpsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const resources = await getAdminDigitalResources(id);

  return <DigitalLibraryPage resources={resources} />;
}
