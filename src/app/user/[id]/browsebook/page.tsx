import BrowsePage from "@/Components/Browse/BrowsePage/BrowsePage";
import { getBrowseBooks } from "@/data/getBrowseBooks";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const books = await getBrowseBooks();

  return (
    <BrowsePage
      browse={{
        userId: id,
        title: "Browse Collection",
        subtitle: `${books.length.toLocaleString()} books across all categories and branches`,
        totalCatalogCount: books.length,
        books,
      }}
    />
  );
}
