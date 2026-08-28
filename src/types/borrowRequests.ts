export type BorrowRequestStatus = "pending" | "approved" | "declined";

export type IncomingBorrowRequest = {
  id: string;
  userName: string;
  initials: string;
  avatarColor: string;
  bookTitle: string;
  coverImage: string;
  status: BorrowRequestStatus;
  requestedAt: string;
};

export type BorrowRequestFilter = {
  id: string;
  label: string;
  status: BorrowRequestStatus | "all";
  count: number;
};

export type BorrowRequestsData = {
  title: string;
  subtitle: string;
  filters: BorrowRequestFilter[];
  requests: IncomingBorrowRequest[];
};
