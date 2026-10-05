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
    | "purchases-today"
    | "downloads-today"
    | "fines-due";
  label: string;
  value: string;
  trend: AdminStatTrend;
};

export type MonthlyBorrowPoint = {
  month: string;
  borrows: number;
  returns: number;
  purchases: number;
  downloads: number;
};

export type UserActivitySlice = {
  id: "active" | "overdue" | "reserved" | "inactive";
  label: string;
  value: number;
  color: string;
};

export type CategoryCount = {
  category: string;
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
  booksByCategory: CategoryCount[];
  recentActivity: AdminActivityItem[];
};
