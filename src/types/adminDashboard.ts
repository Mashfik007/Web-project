export type AdminStatTrend = {
  value: number;
  direction: "up" | "down";
  tone: "positive" | "negative";
};

export type AdminStat = {
  id:
    | "total-books"
    | "active-users"
    | "borrows-today"
    | "overdue"
    | "fines-due"
    | "reservations";
  label: string;
  value: string;
  trend: AdminStatTrend;
};

export type MonthlyBorrowPoint = {
  month: string;
  borrows: number;
  returns: number;
};

export type UserActivitySlice = {
  id: "active" | "overdue" | "reserved" | "inactive";
  label: string;
  value: number;
  color: string;
};

export type GenreCount = {
  genre: string;
  count: number;
};

export type AdminActivityItem = {
  id: string;
  name: string;
  initials: string;
  action: string;
  time: string;
  avatarClass: string;
};

export type AdminDashboardData = {
  adminId: string;
  adminName: string;
  stats: AdminStat[];
  monthlyBorrows: MonthlyBorrowPoint[];
  borrowYearLabel: string;
  userActivity: UserActivitySlice[];
  userActivityTotal: number;
  booksByGenre: GenreCount[];
  recentActivity: AdminActivityItem[];
};
