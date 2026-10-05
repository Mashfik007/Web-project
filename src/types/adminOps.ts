export type AdminBorrowStatus = "Pending" | "Approved" | "Rejected";

export type AdminBorrowRequest = {
  id: string;
  member: string;
  initials: string;
  avatarClass: string;
  book: string;
  requested: string;
  expectedReturn: string;
  status: AdminBorrowStatus;
  reason: string;
};

export type AdminReturnStatus = "Returned" | "Overdue" | "Due Today" | "Active";

export type AdminReturnRecord = {
  id: string;
  member: string;
  initials: string;
  avatarClass: string;
  book: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  daysOverdue: number;
  fine: number;
  status: AdminReturnStatus;
};

export type AdminReservationStatus = "Ready" | "Waiting" | "Expired";

export type AdminReservation = {
  id: string;
  member: string;
  initials: string;
  avatarClass: string;
  book: string;
  reservedDate: string;
  queue: number;
  estWait: string;
  status: AdminReservationStatus;
};

export type AdminFineType = "Overdue" | "Damage" | "Lost";
export type AdminFineStatus = "Pending" | "Paid" | "Waived";

export type AdminFine = {
  id: string;
  member: string;
  initials: string;
  avatarClass: string;
  book: string;
  type: AdminFineType;
  amount: number;
  date: string;
  status: AdminFineStatus;
};

export type AdminFineSummary = {
  totalCollected: number;
  pendingAmount: number;
  waived: number;
  thisMonth: number;
};

export type AdminDigitalResource = {
  id: string;
  title: string;
  author: string;
  format: "PDF" | "EPUB";
  category: string;
  downloads: number;
  size: string;
  fileId: string;
  coverClass: string;
};

export type AdminReportPoint = {
  month: string;
  borrows: number;
};

export type AdminReportPeriod = "week" | "month" | "year" | "custom";

export type AdminReportTab =
  | "borrows"
  | "users"
  | "fines"
  | "inventory"
  | "sales"
  | "downloads";

export type AdminOrderStatus = "processing" | "in-transit" | "delivered";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  member: string;
  initials: string;
  avatarClass: string;
  book: string;
  quantity: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  status: AdminOrderStatus;
  placedAt: string;
};

export type AdminOrderSummary = {
  totalOrders: number;
  revenue: number;
  thisMonth: number;
  processing: number;
};

export type AdminReportRow = {
  primary: string;
  secondary: string;
  value: string;
  extra: string;
};

export type AdminReport = {
  trends: AdminReportPoint[];
  chartTitle: string;
  seriesName: string;
  tableTitle: string;
  columns: [string, string, string, string];
  rows: AdminReportRow[];
};

export type AdminTopBook = {
  title: string;
  category: string;
  borrows: number;
  rating: number;
};
