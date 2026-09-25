export type NetworkStat = {
  id: string;
  label: string;
  value: number;
  theme: "blue" | "purple" | "green";
};

export type CommunityBook = {
  id?: string;
  title: string;
  author: string;
  coverImage: string;
};

export type FriendStatus = "none" | "outgoing" | "incoming" | "friends";

export type CommunityMember = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  location: string;
  isFriend: boolean;
  friendStatus: FriendStatus;
  streakDays: number;
  booksBorrowed: number;
  readingNow: CommunityBook[];
  finished: CommunityBook[];
  currentlyReading: CommunityBook;
};

export type CommunityBorrowStep = "pending" | "approved" | "on-loan" | "returned";

export type CommunityBorrowTracker = {
  id: string;
  requestedFrom: string;
  bookTitle: string;
  currentStep: CommunityBorrowStep;
  dotColor: string;
};

export type ReadingFeedItem = {
  id: string;
  userName: string;
  initials: string;
  avatarColor: string;
  timeAgo: string;
  likes: number;
  book: {
    title: string;
    author: string;
    coverImage: string;
  };
  progressPercent: number;
  quote: string;
};

export type CommunityTab = {
  id: string;
  label: string;
};

export type CommunityShelfHeader = {
  brand: string;
  title: string;
  subtitle: string;
};

export type CommunityShelfData = {
  viewerId: string;
  header: CommunityShelfHeader;
  stats: NetworkStat[];
  tabs: CommunityTab[];
  members: CommunityMember[];
  borrowRequests: CommunityBorrowTracker[];
  activeRequestCount: number;
  readingFeed: ReadingFeedItem[];
};
