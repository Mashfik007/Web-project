import PublishersPage from "@/Components/AdminCatalog/PublishersPage/PublishersPage";
import { getArchivedPublishers } from "@/data/getArchivedPublishers";
import { getPublishersData } from "@/data/getPublishersData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [publishers, archivedPublishers] = await Promise.all([
    getPublishersData(id),
    getArchivedPublishers(),
  ]);

  return (
    <PublishersPage
      publishers={publishers}
      archivedPublishers={archivedPublishers}
    />
  );
}
