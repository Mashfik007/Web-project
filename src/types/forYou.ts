export type GenrePreference = {
  rank: number;
  genre: string;
  percentage: number;
  color: string;
};

export type BorrowingHabitGenre = {
  genre: string;
  count: number;
  percentage: number;
  color: string;
};

export type BorrowingHabits = {
  totalBooks: number;
  months: number;
  genreCount: number;
  genres: BorrowingHabitGenre[];
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
  genre?: string;
  isNew?: boolean;
};

export type RecommendationSection = {
  id: string;
  title: string;
  description: string;
  highlightGenres?: string[];
  badge?: string;
  iconTheme: "blue" | "orange";
  books: RecommendedBook[];
};

export type ExploreGenre = {
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
  topGenres: GenrePreference[];
};

export type ForYouData = {
  header: ForYouHeader;
  borrowingHabits: BorrowingHabits;
  sections: RecommendationSection[];
  exploreGenres: ExploreGenre[];
  catalogHref: string;
};
