import AuthorsPage from "@/Components/AdminCatalog/AuthorsPage/AuthorsPage";
import { getAuthorsData } from "@/data/getAuthorsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const authors = await getAuthorsData(id);

  return <AuthorsPage authors={authors} />;
}
