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

export type ShelfPerson = {
  id: string;
  name: string;
  following: boolean;
};

export type ShelfBook = {
  id: string | number;
  title: string;
  author: string;
  category: string;
  pages: number;
  currentPage: number;
  coverImage: string;
  dueDate: string;
  daysLeft: number;
  blindDate?: boolean;
  checkedOut?: boolean;
};

export type DueDateItem = {
  id: string | number;
  title: string;
  coverImage: string;
  dueDate: string;
};

export type CategoryStat = {
  category: string;
  count: number;
  percentage: number;
};

export type ShelfTab = {
  id: string;
  label: string;
  count: number;
};

export type MyShelfData = {
  userId: string;
  user: ShelfUser;
  stats: ShelfStat[];
  tabs: ShelfTab[];
  currentlyReading: ShelfBook[];
  completed: ShelfBook[];
  wantToRead: ShelfBook[];
  borrowedHistory: ShelfBook[];
  activity: number[];
  dueDates: DueDateItem[];
  categories: CategoryStat[];
  people: ShelfPerson[];
};
