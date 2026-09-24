import BooksPage from "@/Components/AdminCatalog/BooksPage/BooksPage";
import { getArchivedBooks } from "@/data/getArchivedBooks";
import { getBooksData } from "@/data/getBooksData";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    author?: string;
    category?: string;
    catergory?: string;
    available?: string;
  }>;
}

function filterValue(value: string | undefined) {
  if (!value) return "";
  return value.trim().replace(/^"+|"+$/g, "");
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const author = filterValue(query.author) || "all";
  const category =
    filterValue(query.category ?? query.catergory) || "all";
  const available = filterValue(query.available) || "all";

  if (!filterValue(query.author) || !filterValue(query.category ?? query.catergory) || !filterValue(query.available)) {
    redirect(
      `/admin/${id}/books?author=${encodeURIComponent(author)}&category=${encodeURIComponent(category)}&available=${encodeURIComponent(available)}`,
    );
  }

  const [books, archivedBooks] = await Promise.all([
    getBooksData(id, { author, category, available }),
    getArchivedBooks(),
  ]);

  return (
    <BooksPage
      adminId={id}
      books={books}
      archivedBooks={archivedBooks}
      author={author}
      category={category}
      available={available}
    />
  );
}
