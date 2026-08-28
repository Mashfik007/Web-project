import BorrowingHabitsCard from "../BorrowingHabitsCard/BorrowingHabitsCard";
import ExploreByGenre from "../ExploreByGenre/ExploreByGenre";
import RecommendationSection from "../RecommendationSection/RecommendationSection";
import RemixHeader from "../RemixHeader/RemixHeader";
import type { ForYouData } from "@/types/forYou";

interface ForYouPageProps {
  forYou: ForYouData;
}

export default function ForYouPage({ forYou }: ForYouPageProps) {
  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <RemixHeader header={forYou.header} />
          <BorrowingHabitsCard habits={forYou.borrowingHabits} />
        </div>

        {forYou.sections.map((section) => (
          <RecommendationSection key={section.id} section={section} />
        ))}

        <ExploreByGenre
          genres={forYou.exploreGenres}
          catalogHref={forYou.catalogHref}
        />
      </div>
    </main>
  );
}
