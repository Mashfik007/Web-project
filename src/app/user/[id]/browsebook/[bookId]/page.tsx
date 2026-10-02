import BookDetailsPage from "@/Components/BookDetails/BookDetailsPage/BookDetailsPage";
import { getBookDetails } from "@/data/getBookDetails";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; bookId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, bookId } = await params;
  const book = await getBookDetails(bookId, id);

  if (!book) {
    notFound();
  }

  return (
    <BookDetailsPage
      book={book}
      userId={id}
      backHref={`/user/${id}/browsebook`}
      checkoutHref={`/user/${id}/checkout/${bookId}`}
    />
  );
}
