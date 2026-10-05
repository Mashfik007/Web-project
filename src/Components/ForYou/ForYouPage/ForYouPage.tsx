"use client";

import { useState } from "react";
import BorrowingHabitsCard from "../BorrowingHabitsCard/BorrowingHabitsCard";
import ExploreByCategory from "../ExploreByCategory/ExploreByCategory";
import RecommendationSection from "../RecommendationSection/RecommendationSection";
import RemixHeader from "../RemixHeader/RemixHeader";
import WantToReadModal, {
  loadWantToReadBooks,
  type WantToReadBook,
} from "../WantToReadModal/WantToReadModal";
import { openModal } from "@/Components/Modal";
import type { ForYouData } from "@/types/forYou";

interface ForYouPageProps {
  forYou: ForYouData;
  userId: string;
}

export default function ForYouPage({ forYou, userId }: ForYouPageProps) {
  const [wantToRead, setWantToRead] = useState<WantToReadBook[]>([]);
  const [hasActiveReading, setHasActiveReading] = useState(false);

  async function showWantToRead() {
    const shelf = await loadWantToReadBooks();
    setWantToRead(shelf.books);
    setHasActiveReading(shelf.hasActiveReading);
    openModal("want-to-read");
  }

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <RemixHeader
            header={forYou.header}
            userId={userId}
            onWantToReadChange={showWantToRead}
          />
          <BorrowingHabitsCard habits={forYou.borrowingHabits} />
        </div>

        {forYou.sections
          .filter((section) => section.books.length > 0)
          .map((section) => (
            <RecommendationSection
              key={section.id}
              section={section}
              userId={userId}
              onWantToReadChange={showWantToRead}
            />
          ))}

        <ExploreByCategory
          categories={forYou.exploreCategories}
          catalogHref={forYou.catalogHref}
        />
      </div>

      <WantToReadModal
        userId={userId}
        books={wantToRead}
        hasActiveReading={hasActiveReading}
        onBooksChange={setWantToRead}
      />
    </main>
  );
}
