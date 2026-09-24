export type DashboardIntro = {
  name: string;
  dueBooks: number;
  streak: number;
  forYouHref: string;
  browseHref: string;
};

export type DashboardReading = {
  counts: {
    reading: number;
    completed: number;
    want: number;
    history: number;
  };
  completed: {
    title: string;
    author: string;
    coverImage: string;
  }[];
  current: {
    title: string;
    author: string;
    coverImage: string;
    progress: number;
    detail: string;
  } | null;
};

export type DashboardData = {
  userId: string;
  intro: DashboardIntro;
  reading: DashboardReading;
};
