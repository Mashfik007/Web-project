export type CategoryPreference = {
  rank: number;
  category: string;
  percentage: number;
  color: string;
};

export type BorrowingHabitCategory = {
  category: string;
  count: number;
  percentage: number;
  color: string;
};

export type BorrowingHabits = {
  totalBooks: number;
  months: number;
  categoryCount: number;
  categories: BorrowingHabitCategory[];
  blendSlider: {
    leftLabel: string;
    rightLabel: string;
    value: number;
    balanceLabel: string;
    hint: string;
  };
};

export type RecommendedBook = {
  id: string | number;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  matchPercent: number;
  category?: string;
  isNew?: boolean;
};

export type RecommendationSection = {
  id: string;
  title: string;
  description: string;
  highlightCategories?: string[];
  badge?: string;
  iconTheme: "blue" | "orange";
  books: RecommendedBook[];
};

export type ExploreCategory = {
  id: string;
  label: string;
  color: string;
  backgroundColor: string;
};

export type ForYouHeader = {
  label: string;
  title: string;
  titleAccent: string;
  description: string;
  topCategories: CategoryPreference[];
};

export type ForYouData = {
  header: ForYouHeader;
  borrowingHabits: BorrowingHabits;
  sections: RecommendationSection[];
  exploreCategories: ExploreCategory[];
  catalogHref: string;
};
