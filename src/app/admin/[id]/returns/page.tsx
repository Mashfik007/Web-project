import ReturnsPage from "@/Components/AdminOps/ReturnsPage/ReturnsPage";
import { getAdminReturns } from "@/data/getAdminReturns";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const records = await getAdminReturns(id);

  return <ReturnsPage records={records} />;
}
