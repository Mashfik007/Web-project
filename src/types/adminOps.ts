export type AdminBorrowStatus = "Pending" | "Approved" | "Rejected";

export type AdminBorrowRequest = {
  id: number;
  member: string;
  initials: string;
  avatarClass: string;
  book: string;
  requested: string;
  expectedReturn: string;
  status: AdminBorrowStatus;
};

export type AdminReturnStatus = "Returned" | "Overdue" | "Due Today" | "Active";

export type AdminReturnRecord = {
  id: number;
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
  id: number;
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
  id: number;
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
  id: number;
  title: string;
  author: string;
  format: "PDF" | "EPUB";
  category: string;
  downloads: number;
  size: string;
  coverClass: string;
};

export type AdminReportPoint = {
  month: string;
  borrows: number;
};

export type AdminTopBook = {
  title: string;
  category: string;
  borrows: number;
  rating: number;
};

export type AdminNoticeStatus = "Sent" | "Scheduled" | "Draft";

export type AdminNotice = {
  id: number;
  title: string;
  message: string;
  audience: string;
  priority: "Normal" | "High";
  status: AdminNoticeStatus;
  recipients: number;
  date: string;
};

export type AdminScan = {
  id: number;
  title: string;
  author: string;
  time: string;
  status: "Issued" | "Returned";
};
