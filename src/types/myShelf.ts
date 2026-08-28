export type ShelfUser = {
  initials: string;
  name: string;
  quote: string;
  branch: string;
  memberSince: number;
  followers: number;
  following: number;
  booksThisYear: number;
  streakDays: number;
};

export type ShelfStat = {
  id: string;
  label: string;
  value: number;
  subtitle: string;
  theme: "blue" | "purple" | "pink" | "amber";
};

export type ShelfBook = {
  id: number;
  title: string;
  author: string;
  genre: string;
  pages: number;
  currentPage: number;
  coverImage: string;
  dueDate: string;
  daysLeft: number;
};

export type DueDateItem = {
  id: number;
  title: string;
  coverImage: string;
  dueDate: string;
};

export type GenreStat = {
  genre: string;
  count: number;
  percentage: number;
};

export type ShelfTab = {
  id: string;
  label: string;
  count: number;
};

export type MyShelfData = {
  user: ShelfUser;
  stats: ShelfStat[];
  tabs: ShelfTab[];
  currentlyReading: ShelfBook[];
  completed: ShelfBook[];
  wantToRead: ShelfBook[];
  borrowedHistory: ShelfBook[];
  activity: number[];
  dueDates: DueDateItem[];
  genres: GenreStat[];
};
