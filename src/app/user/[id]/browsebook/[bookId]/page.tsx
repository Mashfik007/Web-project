import BookDetailsPage from "@/Components/BookDetails/BookDetailsPage/BookDetailsPage";
import { getBookDetailsData } from "@/Components/BookDetails/data/fakeBookData";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; bookId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, bookId } = await params;
  const result = await getBookDetailsData(id, bookId);

  if (!result) {
    notFound();
  }

  const { book, backHref, checkoutHref } = result;

  return (
    <BookDetailsPage
      book={book}
      backHref={backHref}
      checkoutHref={checkoutHref}
    />
  );
}
