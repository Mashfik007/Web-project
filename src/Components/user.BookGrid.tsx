import type { Book } from "@/types/book";
import BookCard from "./user.BookCard";

interface BookGridProps {
  books: Book[];
  userId: string;
}

export default function BookGrid({ books, userId }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {books.length === 0 ? (
        <p className="col-span-full py-16 text-center text-sm text-slate-500">
          No books match the selected filters.
        </p>
      ) : (
        books.map((book) => (
          <BookCard key={book.id} book={book} userId={userId} />
        ))
      )}
    </div>
  );
}
