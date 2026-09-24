import AuthorsPage from "@/Components/AdminCatalog/AuthorsPage/AuthorsPage";
import { getArchivedAuthors } from "@/data/getArchivedAuthors";
import { getAuthorsData } from "@/data/getAuthorsData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [authors, archivedAuthors] = await Promise.all([
    getAuthorsData(id),
    getArchivedAuthors(),
  ]);

  return <AuthorsPage authors={authors} archivedAuthors={archivedAuthors} />;
}
