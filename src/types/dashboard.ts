export type DashboardIntro = {
  greeting: string;
  name: string;
  dueBooks: number;
  streak: number;
  forYouHref: string;
  browseHref: string;
};

export type DashboardBook = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  progress?: number;
  detail?: string;
};

export type DashboardReading = {
  counts: {
    reading: number;
    completed: number;
    want: number;
    history: number;
  };
  currentlyReading: DashboardBook[];
  completed: DashboardBook[];
  wantToRead: DashboardBook[];
  history: DashboardBook[];
};

export type DashboardActivityItem = {
  id: string;
  color: string;
  action: string;
  subject: string;
  suffix?: string;
  time: string;
};

export type DashboardStreakDay = {
  key: string;
  label: string;
  state: "pad" | "read" | "missed" | "ahead";
};

export type DashboardStreak = {
  current: number;
  best: number;
  days: DashboardStreakDay[];
};

export type DashboardMonth = {
  month: string;
  value: number;
};

export type DashboardBadgeIcon =
  | "book"
  | "streak"
  | "hours"
  | "friends"
  | "speed"
  | "century";

export type DashboardBadge = {
  name: string;
  description: string;
  active: boolean;
  icon: DashboardBadgeIcon;
};

export type DashboardData = {
  userId: string;
  intro: DashboardIntro;
  reading: DashboardReading;
  activity: DashboardActivityItem[];
  streak: DashboardStreak;
  booksPerMonth: DashboardMonth[];
  badges: DashboardBadge[];
  heatmap: number[];
};
