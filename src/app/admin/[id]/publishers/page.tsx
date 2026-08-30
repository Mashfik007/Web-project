import PublishersPage from "@/Components/AdminCatalog/PublishersPage/PublishersPage";
import { getPublishersData } from "@/data/getPublishersData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const publishers = await getPublishersData(id);

  return <PublishersPage publishers={publishers} />;
}
