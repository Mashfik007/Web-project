import AutoHoldBanner from "../AutoHoldBanner/AutoHoldBanner";
import BackLink from "../BackLink/BackLink";
import BookHeader from "../BookHeader/BookHeader";
import BookSidebar from "../BookSidebar/BookSidebar";
import BookTabs from "../BookTabs/BookTabs";
import CommunityShelf from "../CommunityShelf/CommunityShelf";
import MatchScore from "../MatchScore/MatchScore";
import PurchaseCard from "../PurchaseCard/PurchaseCard";
import ReturnReview from "../ReturnReview/ReturnReview";
import type { BookDetails } from "@/types/bookDetails";

interface BookDetailsPageProps {
  book: BookDetails;
  userId: string;
  backHref: string;
  checkoutHref: string;
}

export default function BookDetailsPage({
  book,
  userId,
  backHref,
  checkoutHref,
}: BookDetailsPageProps) {
  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl px-2 py-2 md:px-4">
        <BackLink href={backHref} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <BookSidebar book={book} userId={userId} />

          <div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <BookHeader book={book} />
                <AutoHoldBanner />
              </div>

              <div className="xl:pt-0">
                <PurchaseCard price={book.price} checkoutHref={checkoutHref} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <BookTabs metadata={book.metadata} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <CommunityShelf community={book.community} bookId={String(book.id)} />
          <MatchScore matchScore={book.matchScore} />
          <ReturnReview />
        </div>
      </div>
    </main>
  );
}
