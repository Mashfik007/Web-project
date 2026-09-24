import BooksPage from "@/Components/AdminCatalog/BooksPage/BooksPage";
import { getBooksData } from "@/data/getBooksData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const books = await getBooksData(id);

  return <BooksPage books={books} />;
}
