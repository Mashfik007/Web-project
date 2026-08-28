export type DashboardIntro = {
  name: string;
  dueBooks: number;
  streak: number;
  forYouHref: string;
  browseHref: string;
};

export type DashboardData = {
  userId: string;
  intro: DashboardIntro;
};
